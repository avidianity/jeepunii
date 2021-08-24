import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { JeepService } from 'src/jeep/jeep.service';
import { LocationService } from 'src/location/location.service';
import { SessionPassenger } from 'src/models/session-passenger.entity';

@Injectable()
export class AnalyticsService {
	constructor(
		protected location: LocationService,
		protected jeep: JeepService,
	) {}

	async topRoutes() {
		return await this.location.all({
			order: {
				stops: 'DESC',
			},
		});
	}

	async jeeps() {
		return await this.jeep.all({
			relations: ['passengers'],
		});
	}

	async sales() {
		const sessions = await SessionPassenger.find();
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
}
