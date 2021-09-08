import { Column, Entity, OneToMany, BeforeRemove } from 'typeorm';
import { Jeep } from './jeep.entity';
import { Model } from './model.entity';
import { User } from './user.entity';

@Entity()
export class Cooperative extends Model {
	protected fillable() {
		return ['name', 'description', 'website', 'approved'];
	}

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	website: string;

	@Column()
	approved: boolean;

	@OneToMany(() => User, (user) => user.cooperative)
	users: User[];

	@OneToMany(() => Jeep, (jeep) => jeep.cooperative)
	jeeps: Jeep[];

	@BeforeRemove()
	async removeRelations() {
		const fresh = await Cooperative.findOneOrFail(this.id, {
			relations: ['users', 'jeeps'],
		});

		await Promise.all(fresh.users.map((user) => user.remove()));

		await Promise.all(fresh.jeeps.map((jeep) => jeep.remove()));
	}
}
