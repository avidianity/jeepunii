import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { JeepService } from 'src/jeep/jeep.service';
import { LogsService } from 'src/logs/logs.service';
import { Session } from 'src/models/session.entity';
import { User } from 'src/models/user.entity';
import { UserService } from 'src/user/user.service';
import { SocketService } from 'src/ws/socket.service';

@Injectable()
export class DriversService {
	constructor(
		protected logs: LogsService,
		protected jeep: JeepService,
		protected user: UserService,
		protected socket: SocketService,
	) {}

	async makeSession(driver: User) {
		if (!driver.jeep) {
			throw new BadRequestException(
				'Driver is not assigned to any jeep.',
			);
		}

		try {
			const session = await Session.createQueryBuilder('session')
				.where('session.driverID = :driverId', { driverId: driver.id })
				.where('DATE(session.createdAt) >= CURDATE()')
				.leftJoinAndSelect('session.points', 'point')
				.leftJoinAndSelect(
					'session.passengers',
					'session_passenger',
					'session_passenger.done = :done',
					{
						done: false,
					},
				)
				.leftJoinAndSelect('session_passenger.passenger', 'passenger')
				.leftJoinAndSelect('session.driver', 'driver')
				.leftJoinAndSelect('driver.picture', 'picture')
				.leftJoinAndSelect('driver.jeep', 'jeep')
				.getOneOrFail();

			if (session.done) {
				session.done = false;
				await session.save();
			}

			return session;
		} catch (_) {
			return await Session.create({
				driver,
				points: [],
				passengers: [],
			}).save();
		}
	}

	async getSession(driver: User) {
		if (!driver.jeep) {
			throw new BadRequestException(
				'Driver is not assigned to any jeep.',
			);
		}

		try {
			const session = await Session.createQueryBuilder('session')
				.where('session.driverID = :driverId', { driverId: driver.id })
				.where('DATE(session.createdAt) >= CURDATE()')
				.where('session.done = :done', { done: false })
				.leftJoinAndSelect('session.points', 'point')
				.leftJoinAndSelect(
					'session.passengers',
					'session_passenger',
					'session_passenger.done = :done',
					{
						done: false,
					},
				)
				.leftJoinAndSelect('session_passenger.passenger', 'passenger')
				.leftJoinAndSelect('session.driver', 'driver')
				.leftJoinAndSelect('driver.picture', 'picture')
				.leftJoinAndSelect('driver.jeep', 'jeep')
				.getOneOrFail();

			return session;
		} catch (_) {
			return null;
		}
	}

	async assign(userID: number, jeepID: number) {
		const jeep = await this.jeep.find(jeepID);
		const user = await this.user.find(userID);

		if (user.role !== 'Driver') {
			throw new ForbiddenException('User is not a driver.');
		}

		if (user.jeep) {
			user.jeep.driver = null;
			await user.jeep.save();
		}

		jeep.driver = user;

		const self = this.logs.getUser();

		this.logs.log(
			`${self.getFullname()} assigned ${user.getFullname()} as the driver for ${jeep.getDetails()}.`,
			self,
		);

		this.socket.emit(`user.${user.id}.assign`, { jeep });

		return [user, await jeep.save()];
	}

	async unassign(userID: number, jeepID: number) {
		const user = await this.user.find(userID);
		const jeep = await this.jeep.find(jeepID);

		if (user.role !== 'Driver') {
			throw new ForbiddenException('User is not a driver.');
		}

		if (user.jeep.id !== jeep.id) {
			throw new ForbiddenException('User is not assigned to this jeep.');
		}

		jeep.driver = null;

		await jeep.save();

		const self = this.logs.getUser();

		this.logs.log(
			`${self.getFullname()} unassigned ${user.getFullname()} from ${jeep.getDetails()}.`,
			self,
		);

		this.socket.emit(`user.${user.id}.unassign`, { jeep });

		return [user, jeep];
	}
}
