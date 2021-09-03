import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { Request } from 'express';
import { JeepService } from 'src/jeep/jeep.service';
import { LocationService } from 'src/location/location.service';
import { LogsService } from 'src/logs/logs.service';
import { Location } from 'src/models/location.entity';
import { SessionPassenger } from 'src/models/session-passenger.entity';
import { RolesEnum, User } from 'src/models/user.entity';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class AnalyticsService {
	constructor(
		protected location: LocationService,
		protected jeep: JeepService,
		protected logs: LogsService,
	) {}

	async topRoutes() {
		const options: FindManyOptions<Location> = {
			order: {
				stops: 'DESC',
			},
		};

		const sorter = (first: Location, second: Location) => {
			if (first.stops < second.stops) {
				return -1;
			} else if (first.stops > second.stops) {
				return 1;
			} else {
				return 0;
			}
		};

		if (this.user.role === RolesEnum.DRIVER && this.user.jeep) {
			const jeep = await this.jeep.find(this.user.jeep.id);

			return jeep.passengers
				.map((passenger) => passenger.location)
				.sort(sorter);
		} else if (this.user.role === RolesEnum.PASSENGER) {
			const user = await User.findOne(this.user.id, {
				relations: ['rides', 'rides.location'],
			});

			return user.rides
				.filter((ride) => ride.done)
				.map((ride) => ride.location)
				.sort(sorter);
		}

		return await this.location.all(options);
	}

	async jeeps() {
		if (this.user.role === RolesEnum.PASSENGER) {
			const user = await User.findOne(this.user.id, {
				relations: [
					'rides',
					'rides.jeep',
					'rides.jeep.driver',
					'rides.jeep.driver.picture',
				],
			});

			return user.rides
				.filter((ride) => ride.done)
				.map((ride) => ride.jeep);
		}

		return await this.jeep.all({
			relations: ['passengers'],
		});
	}

	async sales() {
		const sessions = await SessionPassenger.find();

		if ([RolesEnum.DRIVER, RolesEnum.PASSENGER].includes(this.user.role)) {
			return await SessionPassenger.find({
				where: {
					done: true,
				},
				relations: [
					'jeep',
					'jeep.driver',
					'location',
					'passenger',
					'passenger.picture',
				],
			});
		}

		return {
			yearly: sessions
				.map((session) => ({
					...session,
					year: dayjs(session.createdAt).year(),
				}))
				.groupBy('year'),
			monthly: sessions
				.map((session) => ({
					...session,
					month: dayjs(session.createdAt).format('MMMM'),
				}))
				.groupBy('month'),
		};
	}

	get user() {
		return this.logs.getUser();
	}
}
