import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { Session } from './session.entity';

@Entity()
export class SessionPoint extends Model {
	@ManyToOne(() => Session, (session) => session.points)
	session: Session;

	@Column('decimal')
	lat: number;

	@Column('decimal')
	lon: number;
}
