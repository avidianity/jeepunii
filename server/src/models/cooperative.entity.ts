import { Column, Entity, OneToMany } from 'typeorm';
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
}
