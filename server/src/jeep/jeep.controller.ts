import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { CryptoService } from 'src/crypto/crypto.service';
import { CreateJeepDTO } from './dto/create-jeep.dto';
import { UpdateJeepDTO } from './dto/update-jeep.dto';
import { JeepService } from './jeep.service';

@Controller('jeeps')
@UseGuards(HttpBearerGuard)
export class JeepController {
	constructor(protected jeep: JeepService, protected crypto: CryptoService) {}

	@Get()
	async get() {
		return await this.jeep.all();
	}

	@Get(':id/crypto')
	async encrypt(@Param('id') id: number) {
		const jeep = await this.jeep.find(id);
		const payload = jeep.toJSON();
		delete payload.cooperative;
		delete payload.driver;
		return this.crypto.encrypt(payload);
	}

	@Get(':id')
	async show(@Param('id') id: number) {
		return await this.jeep.find(id);
	}

	@Post()
	async create(@Body() data: CreateJeepDTO) {
		return await this.jeep.create(data);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() data: UpdateJeepDTO) {
		return this.jeep.update(id, data);
	}

	@Delete(':id')
	async destroy(@Param('id') id: number) {
		await this.jeep.delete(id);
	}
}
