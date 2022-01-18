import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { LogsService } from 'src/logs/logs.service';
import { Jeep } from 'src/models/jeep.entity';
import { Session } from 'src/models/session.entity';
import { User } from 'src/models/user.entity';
import { UserService } from 'src/user/user.service';
import { SocketService } from 'src/ws/socket.service';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

@Injectable()
export class DriversService {
	constructor(
		protected logs: LogsService,
		protected user: UserService,
		protected socket: SocketService,
	) {}

	async markSessionAsDone(id: number) {
		const session = await Session.findOneOrFail(id);
		session.done = true;
		return await session.save();
	}

	async getPassengersTotal(id: number) {
		const user = await User.findOneOrFail(id, { relations: ['jeep'] });
		const jeep = user.jeep;

		const sessions = await Session.find({
			relations: ['passengers', 'passengers.jeep'],
		});

		return sessions.filter((session) => {
			const same = session.passengers.find(
				(passenger) => passenger.jeep.id === jeep.id,
			);
			return same;
		});
	}

	async makeSession(driver: User) {
		if (!driver.jeep) {
			throw new BadRequestException(
				'Driver is not assigned to any jeep.',
			);
		}

		try {
			const session = await this.getSessionOrFail(driver);

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
			const session = await Session.findOneOrFail({
				relations: [
					'points',
					'passengers',
					'passengers.passenger',
					'passengers.location',
					'driver',
					'driver.jeep',
					'driver.picture',
				],
				where: {
					driver: {
						id: driver.id,
					},
					done: false,
				},
				order: {
					createdAt: 'DESC',
				},
			});

			session.passengers = session.passengers.filter(
				(passengers) => !passengers.done,
			);

			if (!dayjs(session.createdAt).isToday()) {
				return null;
			}

			if (session.driver.id !== driver.id) {
				return null;
			}

			return session;
		} catch (_) {
			return null;
		}
	}

	async getSessionOrFail(driver: User) {
		const session = await this.getSession(driver);

		if (!session) {
			throw new NotFoundException('No session found.');
		}

		return session;
	}

	async hasSession(driver: User) {
		if (!driver.jeep) {
			throw new BadRequestException(
				'Driver is not assigned to any jeep.',
			);
		}

		try {
			await this.getSessionOrFail(driver);
			return true;
		} catch (_) {
			return false;
		}
	}

	async assign(userID: number, jeepID: number) {
		const jeep = await Jeep.findOneOrFail(jeepID);
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
			`${self?.getFullname()} assigned ${user.getFullname()} as the driver for ${jeep.getDetails()}.`,
			self!,
		);

		this.socket.emit(`user.${user.id}.assign`, { jeep });

		return [user, await jeep.save()];
	}

	async unassign(userID: number, jeepID: number) {
		const user = await this.user.find(userID);
		const jeep = await Jeep.findOneOrFail(jeepID);

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
			`${self?.getFullname()} unassigned ${user.getFullname()} from ${jeep.getDetails()}.`,
			self!,
		);

		this.socket.emit(`user.${user.id}.unassign`, { jeep });

		return [user, jeep];
	}
}
