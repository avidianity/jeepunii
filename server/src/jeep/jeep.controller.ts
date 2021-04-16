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
import { CryptoDTO } from './dto/crypto.dto';
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

	@Post('/crypto')
	async decrypt(@Body() data: CryptoDTO) {
		const payload = this.crypto.decrypt(data.payload);
		return await this.jeep.find(payload.id);
	}

	@Get(':id/crypto')
	async encrypt(@Param('id') id: number) {
		const jeep = await this.jeep.find(id);
		return this.crypto.encrypt({
			id: jeep.id,
			name: jeep.name,
			plateNumber: jeep.plateNumber,
		});
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
