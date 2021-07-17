import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { JeepService } from 'src/jeep/jeep.service';
import { LogsService } from 'src/logs/logs.service';
import { SessionPoint } from 'src/models/session-point.entity';
import { Session } from 'src/models/session.entity';
import { User } from 'src/models/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DriversService {
	constructor(
		protected logs: LogsService,
		protected jeep: JeepService,
		protected user: UserService,
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
				.where('DATE(session.createdAt) > CURDATE()')
				.where('session.done = :done', { done: false })
				.limit(1)
				.getOneOrFail();

			session.points = await SessionPoint.createQueryBuilder('point')
				.relation(Session, 'points')
				.of(session)
				.loadMany();

			return session;
		} catch (_) {
			return await Session.create({
				driver,
				points: [],
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
				.where('DATE(session.createdAt) > CURDATE()')
				.where('session.done = :done', { done: false })
				.limit(1)
				.getOneOrFail();

			session.points = await SessionPoint.createQueryBuilder('point')
				.relation(Session, 'points')
				.of(session)
				.loadMany();

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

		return [user, jeep];
	}
}
