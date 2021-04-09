import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { HttpBearerGuard } from 'src/auth/http-bearer.guard';
import { RolesEnum, User } from 'src/models/user.entity';
import { FindManyOptions } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(HttpBearerGuard)
export class UserController {
	constructor(protected users: UserService) {}

	@Get()
	async index(@Query('role') role?: RolesEnum) {
		const options: FindManyOptions<User> = { where: {} };

		if (role) {
			options.where = {
				role,
			};
		}

		const user = this.users.getUser();

		if (!['Admin', 'Passenger'].includes(user.role)) {
			options.where = {
				...(options.where as any),
				cooperative: user.cooperative,
			};
		}

		return await this.users.all(options);
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
