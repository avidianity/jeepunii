import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { CryptoService } from 'src/crypto/crypto.service';
import { Jeep } from 'src/models/jeep.entity';
import { DriversService } from './drivers.service';
import { DriverCryptoDTO } from './dto/driver-crypto.dto';

@Controller('drivers')
@UseGuards(HttpBearerGuard)
export class DriversController {
	constructor(
		protected drivers: DriversService,
		protected crypto: CryptoService,
	) {}

	@Post('/assign')
	async assign(@Body() data: DriverCryptoDTO, @Req() request: Request) {
		const jeep = this.crypto.decrypt(data.payload) as Jeep;
		return await this.drivers.assign(request.user!.id, jeep.id);
	}

	@Post('/unassign')
	async unassign(@Body() data: DriverCryptoDTO, @Req() request: Request) {
		const jeep = this.crypto.decrypt(data.payload) as Jeep;
		return await this.drivers.unassign(request.user!.id, jeep.id);
	}
}
