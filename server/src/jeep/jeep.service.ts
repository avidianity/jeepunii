import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { Cooperative } from 'src/models/cooperative.entity';
import { Jeep } from 'src/models/jeep.entity';
import { User } from 'src/models/user.entity';
import { CreateJeepDTO } from './dto/create-jeep.dto';
import { UpdateJeepDTO } from './dto/update-jeep.dto';

@Injectable()
export class JeepService implements EntityServiceContract<Jeep> {
	async all() {
		return await Jeep.find({ relations: ['cooperative', 'driver'] });
	}

	async find(id: number) {
		const jeep = await Jeep.findOne(id, {
			relations: ['cooperative', 'driver'],
		});

		if (!jeep) {
			throw new NotFoundException('Jeep does not exist.');
		}

		return jeep;
	}

	async create(data: CreateJeepDTO) {
		const cooperative = await Cooperative.findOneOrFail(data.cooperativeId);

		const jeep = new Jeep(data);

		jeep.cooperative = cooperative;

		if (data.driverId) {
			const driver = await User.findOneOrFail(data.driverId);
			jeep.driver = driver;
		}

		return await jeep.save();
	}

	async update(id: number, data: UpdateJeepDTO) {
		const jeep = await this.find(id);

		if (data.cooperativeId) {
			const cooperative = await Cooperative.findOneOrFail(
				data.cooperativeId,
			);
			jeep.cooperative = cooperative;
		}

		if (data.driverId) {
			const driver = await User.findOneOrFail(data.driverId);
			jeep.driver = driver;
		}

		return await jeep.fill(data).save();
	}

	async delete(id: number) {
		const jeep = await this.find(id);

		return await jeep.remove();
	}
}
