import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(HttpBearerGuard)
export class AnalyticsController {
	constructor(protected analytics: AnalyticsService) {}

	@Get('/top-routes')
	async topRoutes() {
		return await this.analytics.topRoutes();
	}

	@Get('/jeeps')
	async jeeps() {
		return await this.analytics.jeeps();
	}

	@Get('/sales')
	async sales() {
		return await this.analytics.sales();
	}
}
