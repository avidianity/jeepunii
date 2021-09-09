import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { CryptoService } from 'src/crypto/crypto.service';
import { DriversService } from 'src/drivers/drivers.service';
import { except, last } from 'src/helpers';
import { SessionPassenger } from 'src/models/session-passenger.entity';
import { SessionPoint } from 'src/models/session-point.entity';
import { RolesEnum } from 'src/models/user.entity';
import { SocketService } from 'src/ws/socket.service';
import { CreateJeepDTO } from './dto/create-jeep.dto';
import { CryptoDTO } from './dto/crypto.dto';
import { PassengerInDTO } from './dto/passenger-in.dto';
import { PassengerOutDTO } from './dto/passenger-out.dto';
import { UpdateJeepDTO } from './dto/update-jeep.dto';
import { JeepService } from './jeep.service';
import haversine from 'haversine-distance';
import { LocationService } from 'src/location/location.service';
import { UserService } from 'src/user/user.service';
import { MoreThanOrEqual } from 'typeorm';

@Controller('jeeps')
@UseGuards(HttpBearerGuard)
export class JeepController {
	constructor(
		protected jeep: JeepService,
		protected crypto: CryptoService,
		protected socket: SocketService,
		protected driver: DriversService,
		protected location: LocationService,
		protected user: UserService,
	) {}

	@Get()
	async get() {
		return await this.jeep.all();
	}

	@Get('/current')
	getCurrent(@Req() request: Request) {
		const { user: driver } = request;

		if (driver.role !== RolesEnum.DRIVER) {
			throw new BadRequestException('User is not a driver.');
		}

		return driver.jeep;
	}

	@Get('/passengers')
	async getPassengers(@Req() request: Request) {
		const { user: driver } = request;

		if (driver.role !== RolesEnum.DRIVER) {
			throw new BadRequestException('User is not a driver.');
		}

		const session = await this.driver.getSession(driver);

		if (!session) {
			throw new BadRequestException(
				'Jeep currently is not on a driving session.',
			);
		}

		const passengers = session.passengers.map(
			(passenger) => passenger.passenger,
		);

		const ids: number[] = [];

		return passengers
			.filter((passenger) => !ids.includes(passenger.id))
			.map((passenger) => {
				ids.push(passenger.id);

				return {
					passenger,
					online: passenger.online,
				};
			});
	}

	@Get('/passenger/:id/:sessionID/points')
	async getPassengerPoints(
		@Param('id') id: number,
		@Param('sessionID') sessionID: number,
	) {
		const passenger = await this.user.find(id, {
			where: { role: RolesEnum.PASSENGER },
		});

		const session = await SessionPassenger.findOneOrFail({
			done: false,
			session: {
				id: sessionID,
			},
			passenger: {
				id: passenger.id,
			},
		});

		const points = await SessionPoint.find({
			id: MoreThanOrEqual(session.startId),
		});

		return points;
	}

	@Get('/passenger/current')
	async getPassengerCurrent(@Req() request: Request) {
		const passenger = request.user;

		if (passenger.role !== RolesEnum.PASSENGER) {
			throw new BadRequestException('User is not a passenger.');
		}

		if (!passenger.riding) {
			throw new BadRequestException(
				'Passenger is not currently riding a jeep.',
			);
		}

		const sessionPassenger = await SessionPassenger.findOneOrFail({
			where: {
				passenger: {
					id: passenger.id,
				},
				done: false,
			},
			relations: ['jeep', 'jeep.driver', 'jeep.driver.picture'],
		});

		const { jeep } = sessionPassenger;
		const { driver } = jeep;

		const session = await this.driver.getSession(driver);

		if (!session) {
			throw new NotFoundException('Passenger has no current session.');
		}

		return { session, jeep, driver };
	}

	@Post('/passenger/in')
	async passengerIn(@Req() request: Request, @Body() data: PassengerInDTO) {
		const passenger = request.user;

		if (passenger.role !== RolesEnum.PASSENGER) {
			throw new BadRequestException('User is not a passenger.');
		}

		if (passenger.riding) {
			throw new BadRequestException(
				'Passenger is currently riding a jeep.',
			);
		}

		if (passenger.coins < 15) {
			throw new BadRequestException(
				'Passenger does not have enough credits.',
			);
		}

		const payload = this.crypto.decrypt(data.payload);
		const jeep = await this.jeep.find(payload.id);

		if (!jeep.driver) {
			throw new BadRequestException('Jeep does not have a driver.');
		}

		const { driver } = jeep;

		driver.jeep = except(jeep, ['driver']);

		const session = await this.driver.getSession(driver);

		if (!session) {
			throw new BadRequestException(
				'Jeep currently is not on a driving session.',
			);
		}

		if (
			(await SessionPassenger.count({
				where: {
					passenger: {
						id: passenger.id,
					},
					session: {
						id: session.id,
					},
					jeep: {
						id: jeep.id,
					},
					done: false,
				},
			})) === 0
		) {
			const lastPoint = await SessionPoint.findOneOrFail({
				where: {
					session: {
						id: session.id,
					},
				},
				order: {
					createdAt: 'DESC',
				},
			});

			await SessionPassenger.create({
				passenger,
				session,
				start_lat: data.lat,
				start_lon: data.lon,
				startId: lastPoint.id,
				jeep,
			}).save();

			this.socket.emit(`session.${session.id}.passenger.in`, passenger);
		}

		passenger.riding = true;
		await passenger.save();

		return { session, jeep, driver };
	}

	@Post('/passenger/out')
	async passengerOut(@Req() request: Request, @Body() data: PassengerOutDTO) {
		const passenger = request.user;

		if (passenger.role !== RolesEnum.PASSENGER) {
			throw new BadRequestException('User is not a passenger.');
		}

		if (!passenger.riding) {
			throw new BadRequestException('Passenger is not riding a jeep.');
		}

		const payload = this.crypto.decrypt(data.payload);
		const jeep = await this.jeep.find(payload.id);

		const sessionPassenger = await SessionPassenger.findOneOrFail(
			{
				passenger: {
					id: passenger.id,
				},
				done: false,
				jeep: {
					id: jeep.id,
				},
			},
			{
				relations: [
					'session',
					'session.points',
					'session.driver',
					'session.driver.jeep',
				],
			},
		);

		const lastPoint = last(sessionPassenger.session.points);

		const points = await SessionPoint.createQueryBuilder('point')
			.where('point.sessionId = :sessionId', {
				sessionId: sessionPassenger.session.id,
			})
			.where('point.id BETWEEN :start AND :end', {
				start: sessionPassenger.startId,
				end: lastPoint.id,
			})
			.getMany();

		const distance = points.reduce((prev, point, index, points) => {
			const next = points[index + 1];
			if (next) {
				return prev + haversine(point, next) / 1000;
			}
			return prev;
		}, 0);

		const fare = (distance / 4) * 1.5 + 10;

		passenger.coins -= fare >= 10 ? fare : 10;
		passenger.riding = false;
		await passenger.save();

		const location = await this.location.make(data.lat, data.lon);

		sessionPassenger.location = location;
		sessionPassenger.done = true;
		sessionPassenger.end_lat = data.lat;
		sessionPassenger.end_lon = data.lon;
		sessionPassenger.endId = lastPoint.id;
		sessionPassenger.fee = fare >= 10 ? fare : 10;
		await sessionPassenger.save();

		location.stops++;

		await location.save();

		this.socket.emit(
			`session.${sessionPassenger.session.id}.passenger.out`,
			passenger,
		);

		return { passenger, sessionPassenger };
	}

	@Post('/crypto')
	async decrypt(@Body() data: CryptoDTO) {
		const payload = this.crypto.decrypt(data.payload);
		return await this.jeep.find(payload.id);
	}

	@Get(':id/crypto')
	async encrypt(@Param('id') id: number) {
		const jeep = await this.jeep.find(id);
		return this.crypto.encrypt({
			id: jeep.id,
			name: jeep.name,
			plateNumber: jeep.plateNumber,
		});
	}

	@Get(':id')
	async show(@Param('id') id: number) {
		return await this.jeep.find(id);
	}

	@Post()
	async create(@Body() data: CreateJeepDTO) {
		return await this.jeep.create(data);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() data: UpdateJeepDTO) {
		return this.jeep.update(id, data);
	}

	@Delete(':id')
	async destroy(@Param('id') id: number) {
		await this.jeep.delete(id);
	}
}
