import {
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
import { CooperativeService } from './cooperative.service';
import { CreateCooperativeDTO } from './dto/create-cooperative.dto';
import { UpdateCooperativeDTO } from './dto/update-cooperative.dto';

@Controller('cooperatives')
export class CooperativeController {
	constructor(protected cooperative: CooperativeService) {}

	@Get()
	async index() {
		return await this.cooperative.all();
	}

	@Get(':id')
	async show(@Param('id') id: number) {
		return await this.cooperative.find(id);
	}

	@Post()
	@UseGuards(HttpBearerGuard)
	async create(@Body() data: CreateCooperativeDTO) {
		return await this.cooperative.create(data);
	}

	@Put(':id')
	@UseGuards(HttpBearerGuard)
	async update(@Param('id') id: number, @Body() data: UpdateCooperativeDTO) {
		return await this.cooperative.update(id, data);
	}

	@Delete(':id')
	@UseGuards(HttpBearerGuard)
	async destroy(@Param('id') id: number) {
		await this.cooperative.delete(id);
	}
}
