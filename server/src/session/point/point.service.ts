import { Injectable, NotFoundException, Session } from '@nestjs/common';
import dayjs from 'dayjs';
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

	async getForJeep(id: number) {
		const all = await this.all({
			where: {
				jeep_id: id,
			},
		});

		const byYear: Record<string, SessionPoint[]> = {};

		all.forEach((item) => {
			const date = dayjs(item.createdAt);

			const year = date.format('YYYY');

			if (!(year in byYear)) {
				byYear[year] = [];
			}

			byYear[year].push(item);
		});

		const byMonth: Record<string, SessionPoint[]> = {};

		for (const year in byYear) {
			const items = byYear[year];

			items.forEach((item) => {
				const date = dayjs(item.createdAt);

				const month = date.format('MMMM');

				const key = `${month} ${year}`;

				if (!(key in byMonth)) {
					byMonth[key] = [];
				}

				byMonth[key].push(item);
			});
		}

		const data: { month: string; data: SessionPoint[] }[] = [];

		for (const month in byMonth) {
			data.push({
				month,
				data: byMonth[month],
			});
		}

		return data;
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
