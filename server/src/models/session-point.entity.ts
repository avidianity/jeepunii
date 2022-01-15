import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { Session } from './session.entity';

@Entity()
export class SessionPoint extends Model {
	@ManyToOne(() => Session, (session) => session.points, { nullable: false })
	session: Session;

	@Column({ nullable: false })
	jeep_id: number;

	@Column('double precision')
	@Index()
	lat: number;

	@Column('double precision')
	@Index()
	lon: number;
}
