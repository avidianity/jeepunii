import { BeforeInsert, Column, Entity, Index, ManyToOne } from 'typeorm';
import { v1 } from 'uuid';
import { Jeep } from './jeep.entity';
import { Location } from './location.entity';
import { Model } from './model.entity';
import { Session } from './session.entity';
import { User } from './user.entity';

@Entity()
export class SessionPassenger extends Model {
	@ManyToOne(() => User, (user) => user.rides)
	passenger: User;

	@ManyToOne(() => Session, (session) => session.passengers)
	session: Session;

	@Column()
	driver_id: number;

	@Column({
		type: 'decimal',
		default: 0,
	})
	fee: number;

	@Column('uuid')
	uuid: string;

	@Column({ default: false })
	done: boolean;

	@Column('double precision')
	start_lat: number;

	@Column('double precision')
	start_lon: number;

	@Column('double precision', { nullable: true })
	end_lat: number;

	@Column('double precision', { nullable: true })
	end_lon: number;

	@Column()
	@Index()
	startId: number;

	@Column({ nullable: true, type: 'bigint' })
	endId: number | null;

	@ManyToOne(() => Jeep, (jeep) => jeep.passengers)
	jeep: Jeep;

	@ManyToOne(() => Location, (location) => location.passengers, {
		nullable: true,
	})
	location: Location;

	@BeforeInsert()
	protected generateUUID() {
		this.uuid = v1();
	}
}
