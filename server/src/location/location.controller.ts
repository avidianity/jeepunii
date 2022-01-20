import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { InfoDTO } from './dto/info.dto';
import { LocationService } from './location.service';

@Controller('locations')
@UseGuards(HttpBearerGuard)
export class LocationController {
	constructor(protected location: LocationService) {}
	@Get('')
	async all() {
		return await this.location.all();
	}

	@Post('/info')
	async getInfo(@Body() data: InfoDTO) {
		const results = await this.location.find(data.lat, data.lon);

		if (results.length > 0) {
			return results.first()!;
		}

		return await this.location.make(data.lat, data.lon);
	}

	@Get(':id')
	async find(@Param('id') id: number) {
		return await this.location.get(id);
	}
}
