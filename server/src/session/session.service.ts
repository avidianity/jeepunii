import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from 'src/models/session.entity';

@Injectable()
export class SessionService {
	async show(id: number) {
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
				.leftJoinAndSelect('session.driver', 'driver')
				.leftJoinAndSelect('driver.picture', 'picture')
				.leftJoinAndSelect('driver.jeep', 'jeep')
				.getOneOrFail();

			return session;
		} catch (_) {
			throw new NotFoundException('Session does not exist.');
		}
	}
}
