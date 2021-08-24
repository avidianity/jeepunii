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
import { only } from 'src/helpers';
import { RolesEnum, User } from 'src/models/user.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
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
		} else {
			const user = this.users.getUser();

			if (![RolesEnum.ADMIN, RolesEnum.PASSENGER].includes(user.role)) {
				options.where = {
					...(options.where as any),
					cooperative: user.cooperative,
				};
			}
		}

		return await this.users.all(options);
	}

	@Get(':id')
	async show(@Param('id') id: number, @Query('role') role?: RolesEnum) {
		const options: FindOneOptions<User> = { where: {} };

		if (role) {
			options.where = {
				role,
			};
		}

		return await this.users.find(id, options);
	}

	@Post()
	async create(@Body() data: CreateUserDTO) {
		return await this.users.create(data);
	}

	@Put(':id/coins')
	async addCoins(@Param('id') id: number, @Body() data: UpdateUserDTO) {
		const user = await this.users.find(id, {
			where: { role: RolesEnum.PASSENGER },
		});

		user.coins += data?.coins || 0;

		return await user.save();
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
