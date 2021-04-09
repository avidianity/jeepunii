import { Column, Entity } from 'typeorm';
import { Cooperative } from './cooperative.entity';
import { Jeep } from './jeep.entity';
import { Model } from './model.entity';
import { User } from './user.entity';

const loggables = {
	[Cooperative.constructor.name]: Cooperative,
	[User.constructor.name]: User,
	[Jeep.constructor.name]: Jeep,
};

@Entity()
export class Log extends Model {
	protected identity: any = null;

	protected fillable() {
		return ['message', 'level', 'identifiable'];
	}

	@Column()
	message: string;

	/**
	 * 1 - Passenger
	 *
	 * 2 - Driver
	 *
	 * 3 - Cooperative Owner
	 *
	 * 4 - Administrator
	 */
	@Column('tinyint')
	level: number;

	@Column()
	identifiable: string;

	async getIdentifiable<T extends Model>(): Promise<T> {
		const fragments = this.identifiable.split(':');

		if (!this.identity) {
			this.identity = await loggables[fragments[0]].findOne(fragments[1]);
		}

		return this.identity;
	}
}
