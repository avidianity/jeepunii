import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { LocationService } from './location.service';

@Controller('locations')
@UseGuards(HttpBearerGuard)
export class LocationController {
	constructor(protected location: LocationService) {}
	@Get('')
	async all() {
		return await this.location.all();
	}

	@Get(':id')
	async find(@Param('id') id: number) {
		return await this.location.get(id);
	}
}
