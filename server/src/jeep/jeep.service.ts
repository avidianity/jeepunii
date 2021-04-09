import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { LogsService } from 'src/logs/logs.service';
import { Cooperative } from 'src/models/cooperative.entity';
import { Jeep } from 'src/models/jeep.entity';
import { User } from 'src/models/user.entity';
import { CreateJeepDTO } from './dto/create-jeep.dto';
import { UpdateJeepDTO } from './dto/update-jeep.dto';

@Injectable()
export class JeepService implements EntityServiceContract<Jeep> {
	constructor(protected logs: LogsService) {}

	async all() {
		const user = this.logs.getUser();
		if (!['Admin', 'Passenger'].includes(user.role)) {
			return await Jeep.find({
				relations: ['cooperative', 'driver'],
				where: {
					cooperative: user.cooperative,
				},
			});
		}
		return await Jeep.find({ relations: ['cooperative', 'driver'] });
	}

	async find(id: number) {
		const user = this.logs.getUser();
		let jeep: Jeep | null = null;

		if (!['Admin', 'Passenger'].includes(user.role)) {
			jeep = await Jeep.findOne(id, {
				relations: ['cooperative', 'driver'],
				where: {
					cooperative: user.cooperative,
				},
			});
		}

		if (!jeep) {
			jeep = await Jeep.findOne(id, {
				relations: ['cooperative', 'driver'],
			});
		}

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

		this.logs.log(
			`${this.logs.getUser().getFullname()} created a jeep.`,
			cooperative,
		);

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

		const updated = await jeep.fill(data).save();

		this.logs.log(
			`${this.logs.getUser().getFullname()} updated a jeep.`,
			updated.cooperative,
		);

		return updated;
	}

	async delete(id: number) {
		const jeep = await this.find(id);

		this.logs.log(
			`${this.logs.getUser().getFullname()} deleted a jeep.`,
			jeep,
		);

		return await jeep.remove();
	}
}
