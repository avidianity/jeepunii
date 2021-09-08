import {
	BeforeRemove,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from 'typeorm';
import { Cooperative } from './cooperative.entity';
import { Model } from './model.entity';
import { SessionPassenger } from './session-passenger.entity';
import { User } from './user.entity';

@Entity()
export class Jeep extends Model {
	protected fillable() {
		return ['name', 'plateNumber'];
	}

	@Column()
	name: string;

	@Column()
	plateNumber: string;

	@ManyToOne(() => Cooperative, (cooperative) => cooperative.jeeps)
	cooperative: Cooperative;

	@OneToOne(() => User, (user) => user.jeep)
	@JoinColumn()
	driver: User;

	@OneToMany(() => SessionPassenger, (session) => session.jeep)
	passengers: SessionPassenger[];

	getDetails() {
		return `${this.name} - ${this.plateNumber}`;
	}

	@BeforeRemove()
	async removeRelations() {
		const fresh = await Jeep.findOneOrFail(this.id, {
			relations: ['passengers'],
		});

		await Promise.all(
			fresh.passengers.map((passenger) => passenger.remove()),
		);
	}
}
