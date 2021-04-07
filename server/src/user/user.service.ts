import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { Cooperative } from 'src/models/cooperative.entity';
import { User } from 'src/models/user.entity';
import { FindManyOptions } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService implements EntityServiceContract<User> {
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

		const user = new User(data);

		user.cooperative = cooperative;

		return await user.save();
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

		return await user.save();
	}

	async delete(id: number) {
		const user = await this.find(id);

		return await user.remove();
	}
}
