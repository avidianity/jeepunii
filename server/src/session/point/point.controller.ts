import { Controller, Get, Param } from '@nestjs/common';
import { PointService } from './point.service';

@Controller('sessions/points')
export class PointController {
	constructor(protected point: PointService) {}

	@Get('/:id')
	async show(@Param('id') id: number) {
		return await this.point.find(id);
	}
}
