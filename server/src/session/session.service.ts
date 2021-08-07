import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityServiceContract } from 'src/interfaces/entity-service-contract.interface';
import { Session } from 'src/models/session.entity';

@Injectable()
export class SessionService implements EntityServiceContract<Session> {
	async all() {
		return await Session.createQueryBuilder('session')
			.leftJoinAndSelect('session.points', 'point')
			.leftJoinAndSelect(
				'session.passengers',
				'session_passenger',
				'session_passenger.done = :done',
				{
					done: false,
				},
			)
			.leftJoinAndSelect('session_passenger.passenger', 'passenger')
			.leftJoinAndSelect('session_passenger.location', 'location')
			.leftJoinAndSelect('session.driver', 'driver')
			.leftJoinAndSelect('driver.picture', 'picture')
			.leftJoinAndSelect('driver.jeep', 'jeep')
			.getMany();
	}

	async find(id: any) {
		try {
			const session = await Session.createQueryBuilder('session')
				.where('session.id = :id', { id })
				.leftJoinAndSelect('session.points', 'point')
				.leftJoinAndSelect(
					'session.passengers',
					'session_passenger',
					'session_passenger.done = :done',
					{
						done: false,
					},
				)
				.leftJoinAndSelect('session_passenger.passenger', 'passenger')
				.leftJoinAndSelect('session_passenger.location', 'location')
				.leftJoinAndSelect('session.driver', 'driver')
				.leftJoinAndSelect('driver.picture', 'picture')
				.leftJoinAndSelect('driver.jeep', 'jeep')
				.getOneOrFail();

			return session;
		} catch (_) {
			throw new NotFoundException('Session does not exist.');
		}
	}

	async create(data: any) {
		return await new Session(data).save();
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
