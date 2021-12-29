import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { LogsService } from 'src/logs/logs.service';
import { Cooperative } from 'src/models/cooperative.entity';
import { FindManyOptions } from 'typeorm';
import { CreateCooperativeDTO } from './dto/create-cooperative.dto';
import { UpdateCooperativeDTO } from './dto/update-cooperative.dto';

@Injectable()
export class CooperativeService implements EntityServiceContract<Cooperative> {
	constructor(protected logs: LogsService) {}

	async all(options?: FindManyOptions<Cooperative>) {
		return await Cooperative.find({
			...options,
			relations: ['users'],
		});
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
		const cooperative = await new Cooperative(data).save();

		const user = this.logs.getUser();

		this.logs.log(`${user?.getFullname()} created a cooperative.`, user!);

		return cooperative;
	}

	async update(id: number, data: UpdateCooperativeDTO) {
		const cooperative = await this.find(id);

		cooperative.fill(data);

		this.logs.log(
			`${this.logs?.getUser()!.getFullname()} updated a cooperative.`,
			cooperative,
		);

		return await cooperative.save();
	}

	async delete(id: number) {
		const cooperative = await this.find(id);

		this.logs.log(
			`${this.logs.getUser()?.getFullname()} deleted a cooperative.`,
			cooperative,
		);

		return await cooperative.remove();
	}
}
