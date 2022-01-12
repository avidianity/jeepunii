import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { SessionPoint } from 'src/models/session-point.entity';
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
		return await SessionPoint.createQueryBuilder('point')
			.leftJoinAndSelect(
				'point.session',
				'session',
				'session.driverId = :driverId',
				{ driverId: id },
			)
			.getMany();
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
