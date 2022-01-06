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
import { LocationService } from 'src/location/location.service';
import { UserService } from 'src/user/user.service';
import { MoreThanOrEqual } from 'typeorm';
import { AnonymousPassengerInDTO } from './dto/anonymous-passenger-in.dto';
import { AnonymousPassengerOutDTO } from './dto/anonymous-passenger-out.dto';

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

		if (driver?.role !== RolesEnum.DRIVER) {
			throw new BadRequestException('User is not a driver.');
		}

		return driver.jeep;
	}

	@Get('/passengers')
	async getPassengers(@Req() request: Request) {
		const { user: driver } = request;

		if (driver?.role !== RolesEnum.DRIVER) {
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

		if (passenger?.role !== RolesEnum.PASSENGER) {
			throw new BadRequestException('User is not a passenger.');
		}

		if (!passenger.riding) {
			throw new BadRequestException(
				'Passenger is not currently riding a jeep.',
			);
		}
		let sessionPassenger: SessionPassenger;

		try {
			sessionPassenger = await SessionPassenger.findOneOrFail({
				where: {
					passenger: {
						id: passenger.id,
					},
					done: false,
				},
				relations: ['jeep', 'jeep.driver', 'jeep.driver.picture'],
			});
		} catch (error) {
			passenger.riding = false;
			await passenger.save();
			throw error;
		}

		const { jeep } = sessionPassenger;
		const { driver } = jeep;

		const session = await this.driver.getSession(driver!);

		if (!session) {
			sessionPassenger.done = true;
			await sessionPassenger.save();
			throw new NotFoundException('Passenger has no current session.');
		}

		return { session, jeep, driver };
	}

	@Post('/passenger/anonymous/in')
	async anonymousPassengerIn(
		@Req() request: Request,
		@Body() data: AnonymousPassengerInDTO,
	) {
		const driver = request.user;

		if (driver?.role !== RolesEnum.DRIVER) {
			throw new BadRequestException('User is not a driver.');
		}

		if (!(await this.driver.hasSession(driver))) {
			throw new BadRequestException(
				'Jeep currently is not on a driving session.',
			);
		}

		const passenger = await this.user.find(data.passengerId, {
			where: {
				role: RolesEnum.PASSENGER,
				anonymous: true,
			},
		});

		const jeep = await this.jeep.findForDriver(driver.id);

		return await this.jeep.assignPassenger(jeep, passenger, data);
	}

	@Post('/passenger/anonymous/out')
	async anonymousPassengerOut(
		@Req() request: Request,
		@Body() data: AnonymousPassengerOutDTO,
	) {
		const driver = request.user;

		if (driver?.role !== RolesEnum.DRIVER) {
			throw new BadRequestException('User is not a driver.');
		}

		if (!(await this.driver.hasSession(driver))) {
			throw new BadRequestException(
				'Jeep currently is not on a driving session.',
			);
		}

		const passenger = await this.user.find(data.passengerId, {
			where: {
				role: RolesEnum.PASSENGER,
				anonymous: true,
			},
		});

		const jeep = await this.jeep.findForDriver(driver.id);

		return await this.jeep.unassignPassenger(jeep, passenger, data);
	}

	@Post('/passenger/in')
	async passengerIn(@Req() request: Request, @Body() data: PassengerInDTO) {
		const passenger = request.user;

		if (passenger?.role !== RolesEnum.PASSENGER) {
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

		const session = await this.jeep.assignPassenger(jeep, passenger, data);

		return { session, jeep, driver: jeep.driver };
	}

	@Post('/passenger/out')
	async passengerOut(@Req() request: Request, @Body() data: PassengerOutDTO) {
		const passenger = request.user;

		if (passenger?.role !== RolesEnum.PASSENGER) {
			throw new BadRequestException('User is not a passenger.');
		}

		if (!passenger.riding) {
			throw new BadRequestException('Passenger is not riding a jeep.');
		}

		const payload = this.crypto.decrypt(data.payload);
		const jeep = await this.jeep.find(payload.id);

		const sessionPassenger = await this.jeep.unassignPassenger(
			jeep,
			passenger,
			data,
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
