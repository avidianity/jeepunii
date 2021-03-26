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
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(HttpBearerGuard)
export class UserController {
	constructor(protected users: UserService) {}

	@Get()
	async index() {
		return await this.users.all();
	}

	@Get(':id')
	async show(@Param('id') id: number) {
		return await this.users.find(id);
	}

	@Post()
	async create(@Body() data: CreateUserDTO) {
		return await this.users.create(data);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() data: UpdateUserDTO) {
		const user = await this.users.update(id, data);

		return user;
	}

	@Delete(':id')
	async destroy(@Param('id') id: number) {
		await this.users.delete(id);
	}
}
