import dayjs from 'dayjs';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Model } from './model.entity';
import { SessionPassenger } from './session-passenger.entity';
import { SessionPoint } from './session-point.entity';
import { User } from './user.entity';

@Entity()
export class Session extends Model {
	protected fillable() {
		return ['driver', 'done'];
	}

	@ManyToOne(() => User, (user) => user.sessions)
	driver: User;

	@Column({ default: false })
	done: boolean;

	@OneToMany(() => SessionPoint, (point) => point.session)
	points: SessionPoint[];

	@OneToMany(() => SessionPassenger, (passenger) => passenger.session)
	passengers: SessionPassenger[];

	current: boolean;

	@AfterLoad()
	protected setCurrent() {
		this.current = dayjs(this.createdAt).isSame(Date.now(), 'day');
	}
}
