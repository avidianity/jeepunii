import { Injectable, NotFoundException, Session } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { SessionPoint } from 'src/models/session-point.entity';
import { User } from 'src/models/user.entity';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class PointService implements EntityServiceContract<SessionPoint> {
	all(options?: FindManyOptions<SessionPoint>) {
		return SessionPoint.find({
			...options,
			relations: ['session'],
		});
	}

	async getForUser(id: number) {
		const user = await User.findOneOrFail(id, {
			relations: ['jeep'],
		});

		return await SessionPoint.find({
			where: {
				jeep_id: user.jeep.id,
			},
		});
	}

	async find(id: any) {
		const point = await SessionPoint.findOne(id, {
			relations: ['session'],
		});

		if (!point) {
			throw new NotFoundException('Point does not exist.');
		}

		return point;
	}

	async create(data: any) {
		return await new SessionPoint(data).save();
	}

	async update(id: number, data: any) {
		const sessionPoint = await this.find(id);

		sessionPoint.fill(data);

		return await sessionPoint.save();
	}

	async delete(id: number) {
		const sessionPoint = await this.find(id);

		return await sessionPoint.remove();
	}
}
