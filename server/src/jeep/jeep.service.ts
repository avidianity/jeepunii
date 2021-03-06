import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import haversine from 'haversine-distance';
import { DriversService } from 'src/drivers/drivers.service';
import { except, last } from 'src/helpers';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { LocationService } from 'src/location/location.service';
import { LogsService } from 'src/logs/logs.service';
import { Cooperative } from 'src/models/cooperative.entity';
import { Jeep } from 'src/models/jeep.entity';
import { SessionPassenger } from 'src/models/session-passenger.entity';
import { SessionPoint } from 'src/models/session-point.entity';
import { Session } from 'src/models/session.entity';
import { RolesEnum, User } from 'src/models/user.entity';
import { SocketService } from 'src/ws/socket.service';
import { Between, FindManyOptions } from 'typeorm';
import { CoordinatesDTO } from './dto/coordinates.dto';
import { CreateJeepDTO } from './dto/create-jeep.dto';
import { UpdateJeepDTO } from './dto/update-jeep.dto';

@Injectable()
export class JeepService implements EntityServiceContract<Jeep> {
	constructor(
		protected logs: LogsService,
		protected socket: SocketService,
		protected location: LocationService,
		protected driver: DriversService,
	) {}

	async findForDriver(driverID: number) {
		return await Jeep.findOneOrFail({
			where: {
				driver: {
					id: driverID,
				},
			},
			relations: [
				'cooperative',
				'driver',
				'passengers',
				'passengers.location',
			],
		});
	}

	async assignPassenger(jeep: Jeep, passenger: User, data: CoordinatesDTO) {
		const { driver } = jeep;

		if (!driver) {
			throw new BadRequestException('Jeep does not have a driver.');
		}

		driver.jeep = except(jeep, ['driver']);

		const session = await this.driver.getSession(driver);

		if (!session) {
			throw new BadRequestException(
				'Jeep currently is not on a driving session.',
			);
		}

		const lastPoint = session.points.last();

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
			})) === 0 &&
			lastPoint
		) {
			await SessionPassenger.create({
				passenger,
				session,
				start_lat: data.lat,
				start_lon: data.lon,
				startId: lastPoint.id,
				jeep,
				driver_id: driver.id,
			}).save();

			this.socket.emit(`session.${session.id}.passenger.in`, passenger);
		}

		passenger.riding = true;
		await passenger.save();

		return session;
	}

	async getPassengerSession(passenger: User) {
		if (passenger?.role !== RolesEnum.PASSENGER) {
			throw new BadRequestException('User is not a passenger.');
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
			passenger.riding = true;
			await passenger.save();
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
			passenger.riding = false;
			await passenger.save();
			await sessionPassenger.save();
			throw new NotFoundException('Passenger has no current session.');
		}

		return { session, jeep, driver };
	}

	async unassignPassenger(jeep: Jeep, passenger: User, data: CoordinatesDTO) {
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
					'passenger',
					'jeep',
				],
			},
		);

		const lastPoint = last(sessionPassenger.session.points);

		const points = await SessionPoint.find({
			where: {
				session: {
					id: sessionPassenger.session.id,
				},
				id: Between(sessionPassenger.startId, lastPoint.id),
			},
		});

		const distance = points.reduce((prev, point, index, points) => {
			const next = points[index + 1];
			if (next) {
				return prev + haversine(point, next) / 1000;
			}
			return prev;
		}, 0);

		const fare = (distance / 4) * 1.5 + 10;

		passenger.coins = passenger.coins - (fare >= 10 ? fare : 10);
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

		return sessionPassenger;
	}

	async all(options?: FindManyOptions<Jeep>) {
		const user = this.logs.getUser();

		if (user && !['Admin', 'Passenger'].includes(user.role)) {
			return await Jeep.find({
				...options,
				relations: [
					...(options?.relations ? options.relations : []),
					'cooperative',
					'driver',
				],
				where: {
					cooperative: user.cooperative,
				},
			});
		}

		return await Jeep.find({
			...options,
			relations: [
				...(options?.relations ? options.relations : []),
				'cooperative',
				'driver',
			],
		});
	}

	async find(id: number) {
		const user = this.logs.getUser();
		let jeep: Jeep | null = null;

		if (user && !['Admin', 'Passenger'].includes(user.role)) {
			jeep =
				(await Jeep.findOne(id, {
					relations: [
						'cooperative',
						'driver',
						'passengers',
						'passengers.location',
						'passengers.passenger',
					],
					where: {
						cooperative: user.cooperative,
					},
				})) || null;
		}

		if (!jeep) {
			jeep =
				(await Jeep.findOne(id, {
					relations: [
						'cooperative',
						'driver',
						'passengers',
						'passengers.location',
						'passengers.passenger',
					],
				})) || null;
		}

		if (!jeep) {
			throw new NotFoundException('Jeep does not exist.');
		}

		return jeep;
	}

	async create(data: CreateJeepDTO) {
		const cooperative = await Cooperative.findOneOrFail(data.cooperativeId);

		let jeep = new Jeep(data);

		jeep.cooperative = cooperative;

		if (data.driverId) {
			const driver = await User.findOneOrFail(data.driverId);
			jeep.driver = driver;
		}

		this.logs.log(
			`${this.logs.getUser()?.getFullname()} created a jeep.`,
			cooperative,
		);

		jeep = await jeep.save();

		if (jeep.driver && data.driverId) {
			this.socket.emit(`user.${jeep.driver.id}.assign`, { jeep });
		}

		return jeep;
	}

	async update(id: number, data: UpdateJeepDTO) {
		const jeep = await this.find(id);

		let previous: any = null;

		if (data.driverId) {
			const driver = await User.findOneOrFail(data.driverId);
			jeep.driver = driver;
		} else {
			const session = await Session.findOne({
				driver: {
					id: jeep.driver?.id,
				},
				done: false,
			});

			if (session) {
				throw new BadRequestException(
					'Driver is currently in a session with the assigned jeep.',
				);
			}

			previous = { ...jeep.driver };
			jeep.driver = null;
		}

		if (data.cooperativeId) {
			const cooperative = await Cooperative.findOneOrFail(
				data.cooperativeId,
			);
			jeep.cooperative = cooperative;
		}

		const updated = await jeep.fill(data).save();

		this.logs.log(
			`${this.logs.getUser()?.getFullname()} updated a jeep.`,
			updated.cooperative,
		);

		if (previous !== null && !data.driverId) {
			this.socket.emit(`user.${previous.id}.unassign`);
		}

		if (jeep.driver && data.driverId) {
			this.socket.emit(`user.${jeep.driver.id}.assign`, { jeep });
		}

		return updated;
	}

	async delete(id: number) {
		const jeep = await this.find(id);

		this.logs.log(
			`${this.logs.getUser()?.getFullname()} deleted a jeep.`,
			jeep,
		);

		return await jeep.remove();
	}
}
