import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from 'src/models/user.entity';

@Injectable()
export class ScheduleService {
	protected readonly logger = new Logger(ScheduleService.name);

	@Cron(CronExpression.EVERY_10_MINUTES)
	async handleRidingPassengers() {
		this.logger.log(`Checking riding passengers.`);

		const users = await User.find({
			where: {
				riding: true,
			},
			relations: ['rides'],
		});

		const updateable = users.filter(
			(user) => !user.rides.find((ride) => !ride.done),
		);

		this.logger.log(`Updateable ${updateable.length}`);

		await Promise.all(
			updateable.map((user) => user.fill({ riding: false }).save()),
		);

		this.logger.log('Done checking riding passengers');
	}
}
