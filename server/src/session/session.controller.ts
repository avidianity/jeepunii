import {
	Controller,
	ForbiddenException,
	Get,
	Param,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { RolesEnum } from 'src/models/user.entity';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
	constructor(protected session: SessionService) {}

	@Get('driver')
	@UseGuards(HttpBearerGuard)
	async driver(@Req() request: Request) {
		if (request.user?.role !== RolesEnum.DRIVER) {
			throw new ForbiddenException('User is not a driver.');
		}

		return await this.session.getForDriver(request.user.id);
	}

	@Get('/:id')
	async show(@Param('id') id: number) {
		return await this.session.find(id);
	}
}
