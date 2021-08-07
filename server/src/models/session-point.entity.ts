import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { Session } from './session.entity';

@Entity()
export class SessionPoint extends Model {
	@ManyToOne(() => Session, (session) => session.points)
	session: Session;

	@Column('double precision')
	@Index()
	lat: number;

	@Column('double precision')
	@Index()
	lon: number;
}
