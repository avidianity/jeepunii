import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { UserService } from 'src/user/user.service';
import { PointService } from './point.service';

@Controller('sessions/points')
export class PointController {
	constructor(protected point: PointService, protected user: UserService) {}

	@Get('/all')
	@UseGuards(HttpBearerGuard)
	async all(@Req() request: Request) {
		const user = await this.user.find(request.user?.id!);

		return await this.point.getForUser(user.id);
	}

	@Get('/:id')
	async show(@Param('id') id: number) {
		return await this.point.find(id);
	}
}
