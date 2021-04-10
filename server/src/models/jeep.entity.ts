import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Cooperative } from './cooperative.entity';
import { Model } from './model.entity';
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

	getDetails() {
		return `${this.name} - ${this.plateNumber}`;
	}
}
