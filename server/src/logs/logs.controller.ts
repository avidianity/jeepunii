import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { Cooperative } from 'src/models/cooperative.entity';
import { LogsService } from './logs.service';

@Controller('logs')
@UseGuards(HttpBearerGuard)
export class LogsController {
	constructor(protected logs: LogsService) {}

	@Get()
	async index() {
		const user = this.logs.getUser();

		if (!['Admin', 'Passenger'].includes(user?.role!)) {
			const logs = await this.logs.all({
				where: {
					identifiable: user?.jeep
						? user.jeep.toID()
						: user?.cooperative.toID(),
				},
			});

			if (user?.role === 'Cooperative Owner') {
				const cooperative = await Cooperative.findOne(
					user.cooperative?.id,
					{ relations: ['jeeps'] },
				);

				const ids = cooperative?.jeeps.map((jeep) => jeep.toID()) || [];

				const jeepLogBatches = await Promise.all(
					ids.map(async (id) => {
						return await this.logs.all({
							where: {
								identifiable: id,
							},
						});
					}),
				);

				jeepLogBatches.forEach((batch) => {
					batch.forEach((log) => logs.push(log));
				});

				return logs;
			}

			return logs;
		}

		return await this.logs.all();
	}
}
