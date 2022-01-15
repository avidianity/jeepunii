import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import dayjs from 'dayjs';
import { Request } from 'express';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { Jeep } from 'src/models/jeep.entity';
import { SessionPoint } from 'src/models/session-point.entity';
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

	@Get('/by-month')
	async allByMonth() {
		const jeeps = await Jeep.find();

		const results = await Promise.all(
			jeeps.map(async (jeep) => ({
				jeep,
				points: await this.point.getForJeep(jeep.id),
			})),
		);

		return results.filter((item) => item.points.length > 0);
	}

	@Get('/:id')
	async show(@Param('id') id: number) {
		return await this.point.find(id);
	}
}
