import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { Log } from 'src/models/log.entity';
import { Model } from 'src/models/model.entity';
import { RolesEnum } from 'src/models/user.entity';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class LogsService implements EntityServiceContract<Log> {
	protected levels = {
		[RolesEnum.ADMIN]: 4,
		[RolesEnum.COOPERATIVE]: 3,
		[RolesEnum.DRIVER]: 2,
		[RolesEnum.PASSENGER]: 1,
	};

	constructor(@Inject(REQUEST) protected request: Request) {}

	getLevel() {
		return this.levels[this.request.user?.role!];
	}

	all(options?: FindManyOptions<Log>) {
		return Log.find({
			...options,
			order: {
				createdAt: 'DESC',
			},
		});
	}

	async find(id: number) {
		const log = await Log.findOne(id);
		if (!log) {
			throw new NotFoundException({ message: 'Log does not exist.' });
		}

		return log;
	}

	async create(data: Partial<Log>) {
		const log = new Log(data);

		return await log.save();
	}

	async update(id: number, data: Partial<Log>) {
		const log = await this.find(id);

		log.fill(data);

		return await log.save();
	}

	async delete(id: number) {
		const log = await this.find(id);

		return await log.remove();
	}

	async get<T extends Model>(model: T) {
		const logs = await Log.find({
			where: {
				identifiable: model.toID(),
			},
		});

		return logs;
	}

	async log<T extends Model>(message: string, model: T) {
		try {
			return await this.create({
				message,
				level: this.levels[this.request.user?.role!],
				identifiable: model.toID(),
			});
		} catch (error) {
			console.error('Unable to log', error);
			return false;
		}
	}

	getUser() {
		return this.request.user;
	}
}
