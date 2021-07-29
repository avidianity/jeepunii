import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { Session } from './session.entity';

@Entity()
export class SessionPoint extends Model {
	@ManyToOne(() => Session, (session) => session.points)
	session: Session;

	@Column('double precision')
	lat: number;

	@Column('double precision')
	lon: number;
}
