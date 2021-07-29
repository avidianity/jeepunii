import { Injectable, NotFoundException } from '@nestjs/common';
import { Hash } from 'src/helpers';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { LogsService } from 'src/logs/logs.service';
import { Cooperative } from 'src/models/cooperative.entity';
import { User } from 'src/models/user.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService implements EntityServiceContract<User> {
	constructor(protected logs: LogsService) {}

	getUser() {
		return this.logs.getUser();
	}

	all(options?: FindManyOptions<User>) {
		return User.find({ ...options, relations: ['cooperative', 'jeep'] });
	}

	async find(id: number, options?: FindOneOptions<User>) {
		const user = await User.findOne(id, {
			relations: ['cooperative', 'jeep', 'files'],
		});

		if (!user) {
			throw new NotFoundException({ message: 'User does not exist.' });
		}

		return user;
	}

	async create(data: CreateUserDTO) {
		let user = new User(data);

		if (data.cooperativeId) {
			const cooperative = await Cooperative.findOneOrFail(
				data.cooperativeId,
			);
			user.cooperative = cooperative;
		}

		data.password = Hash.make(data.password);

		user = await user.save();

		const self = this.logs.getUser();

		this.logs.log(
			`${this.logs.getUser().getFullname()} created a user.`,
			self.role === 'Admin' ? user : user.cooperative,
		);

		return user;
	}

	async update(id: number, data: UpdateUserDTO) {
		const user = await this.find(id);

		if (data.password) {
			data.password = Hash.make(data.password);
		}

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

	getLogsService() {
		return this.logs;
	}
}
