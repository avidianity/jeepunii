import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Req,
	Session,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { CryptoService } from 'src/crypto/crypto.service';
import { Jeep } from 'src/models/jeep.entity';
import { SessionPoint } from 'src/models/session-point.entity';
import { DriversService } from './drivers.service';
import { DriverCryptoDTO } from './dto/driver-crypto.dto';
import { SessionPointDTO } from './dto/session-point.dto';
import { SessionPointsDTO } from './dto/session-points.dto';

@Controller('drivers')
@UseGuards(HttpBearerGuard)
export class DriversController {
	constructor(
		protected drivers: DriversService,
		protected crypto: CryptoService,
	) {}

	@Get('/passengers-count')
	async getPassengersTotal(@Req() request: Request) {
		return await this.drivers.getPassengersTotal(request.user?.id!);
	}

	@Get('/session')
	async getSession(@Req() request: Request) {
		return await this.drivers.getSessionOrFail(request.user!);
	}

	@Post('/session/points')
	async makePoints(
		@Body() { data }: SessionPointsDTO,
		@Req() request: Request,
	) {
		const session = await this.drivers.getSession(request.user!);

		if (!session) {
			throw new BadRequestException(
				'Driver has no driving session currently set.',
			);
		}

		return await Promise.all(
			data.map((item) =>
				SessionPoint.create({
					session,
					lat: item.lat,
					lon: item.lon,
				}).save(),
			),
		);
	}

	@Post('/session/point')
	async makePoint(@Body() data: SessionPointDTO, @Req() request: Request) {
		const session = await this.drivers.getSession(request.user!);
		if (!session) {
			throw new BadRequestException(
				'Driver has no session currently set.',
			);
		}

		return await SessionPoint.create({
			session,
			lat: data.lat,
			lon: data.lon,
		}).save();
	}

	@Post('/session')
	async makeSession(@Req() request: Request) {
		return await this.drivers.makeSession(request.user!);
	}

	@Delete('/session')
	async deleteSession(@Req() request: Request) {
		const session = await this.drivers.getSession(request.user!);
		if (!session) {
			throw new BadRequestException(
				'Driver is currently not in a driving session.',
			);
		}

		this.drivers.markSessionAsDone(session.id);

		return session;
	}

	@Post('/assign')
	async assign(@Body() data: DriverCryptoDTO, @Req() request: Request) {
		const jeep = this.crypto.decrypt<Jeep>(data.payload);
		return await this.drivers.assign(request.user?.id!, jeep.id);
	}

	@Post('/unassign')
	async unassign(@Body() data: DriverCryptoDTO, @Req() request: Request) {
		const jeep = this.crypto.decrypt<Jeep>(data.payload);
		return await this.drivers.unassign(request.user?.id!, jeep.id);
	}
}
