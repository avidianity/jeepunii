import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { Session } from './session.entity';
import { User } from './user.entity';

@Entity()
export class SessionPassenger extends Model {
	@ManyToOne(() => User, (user) => user.rides)
	passenger: User;

	@ManyToOne(() => Session, (session) => session.passengers)
	session: Session;

	@Column({ default: false })
	done: boolean;

	@Column('decimal')
	start_lat: number;

	@Column('decimal')
	start_lon: number;

	@Column('decimal', { nullable: true })
	end_lat: number;

	@Column('decimal', { nullable: true })
	end_lon: number;

	@Index()
	@Column()
	startId: number;

	@Column({ nullable: true })
	endId: number | null;
}
