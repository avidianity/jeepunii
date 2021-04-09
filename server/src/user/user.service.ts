import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { LogsService } from 'src/logs/logs.service';
import { Cooperative } from 'src/models/cooperative.entity';
import { User } from 'src/models/user.entity';
import { FindManyOptions } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService implements EntityServiceContract<User> {
	constructor(protected logs: LogsService) {}

	getUser() {
		return this.logs.getUser();
	}

	all(options?: FindManyOptions<User>) {
		return User.find({ ...options, relations: ['cooperative'] });
	}

	async find(id: number) {
		const user = await User.findOne(id, { relations: ['cooperative'] });
		if (!user) {
			throw new NotFoundException({ message: 'User does not exist.' });
		}

		return user;
	}

	async create(data: CreateUserDTO) {
		const cooperative = await Cooperative.findOneOrFail(data.cooperativeId);

		const user = await new User({
			...data,
			cooperative,
		}).save();

		this.logs.log(
			`${this.logs.getUser().getFullname()} created a user.`,
			user,
		);

		return user;
	}

	async update(id: number, data: UpdateUserDTO) {
		const user = await this.find(id);

		user.fill(data);

		if (data.cooperativeId) {
			const cooperative = await Cooperative.findOneOrFail(
				data.cooperativeId,
			);
			user.cooperative = cooperative;
		}

		this.logs.log(
			`${this.logs.getUser().getFullname()} updated a user.`,
			user,
		);

		return await user.save();
	}

	async delete(id: number) {
		const user = await this.find(id);

		this.logs.log(
			`${this.logs.getUser().getFullname()} deleted a user.`,
			user,
		);

		return await user.remove();
	}
}
