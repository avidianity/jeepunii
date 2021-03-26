import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { Cooperative } from 'src/models/cooperative.entity';
import { CreateCooperativeDTO } from './dto/create-cooperative.dto';
import { UpdateCooperativeDTO } from './dto/update-cooperative.dto';

@Injectable()
export class CooperativeService implements EntityServiceContract<Cooperative> {
	all() {
		return Cooperative.find({ relations: ['users'] });
	}

	async find(id: number) {
		const cooperative = await Cooperative.findOne(id, {
			relations: ['users'],
		});

		if (!cooperative) {
			throw new NotFoundException({
				message: 'Cooperative does not exist.',
			});
		}

		return cooperative;
	}

	async create(data: CreateCooperativeDTO) {
		return await new Cooperative(data).save();
	}

	async update(id: number, data: UpdateCooperativeDTO) {
		const cooperative = await this.find(id);

		cooperative.fill(data);

		return await cooperative.save();
	}

	async delete(id: number) {
		const cooperative = await this.find(id);

		return await cooperative.remove();
	}
}
