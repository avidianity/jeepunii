import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { LogsService } from './logs.service';

@Controller('logs')
@UseGuards(HttpBearerGuard)
export class LogsController {
	constructor(protected logs: LogsService) {}

	@Get()
	async index() {
		const user = this.logs.getUser();

		if (!['Admin', 'Passenger'].includes(user.role)) {
			return await this.logs.all({
				where: {
					identifiable: user.jeep
						? user.jeep.toID()
						: user.cooperative.toID(),
					level: this.logs.getLevel(),
				},
			});
		}

		return await this.logs.all();
	}
}
