import {
	BeforeRemove,
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
} from 'typeorm';
import { Cooperative } from './cooperative.entity';
import { File } from './file.entity';
import { Jeep } from './jeep.entity';
import { Model } from './model.entity';
import { SessionPassenger } from './session-passenger.entity';
import { Session } from './session.entity';
import { Token } from './token.entity';

export enum RolesEnum {
	ADMIN = 'Admin',
	COOPERATIVE = 'Cooperative Owner',
	DRIVER = 'Driver',
	PASSENGER = 'Passenger',
}

@Entity()
export class User extends Model {
	protected fillable() {
		return [
			'firstName',
			'lastName',
			'address',
			'email',
			'phone',
			'password',
			'role',
			'approved',
			'coins',
		];
	}

	protected hidden = ['password', 'currentToken'];

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	address: string;

	@Column({ unique: true })
	email: string;

	@Column()
	phone: string;

	@Column()
	password: string;

	@Column('decimal', { default: 0 })
	coins: number;

	@Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.PASSENGER })
	role: RolesEnum;

	@Column({ default: false })
	approved: boolean;

	@ManyToOne(() => Cooperative, (cooperative) => cooperative.users)
	cooperative: Cooperative;

	@OneToMany(() => Token, (token) => token.user)
	tokens: Token[];

	@OneToOne(() => Jeep, (jeep) => jeep.driver)
	jeep: Jeep;

	@OneToMany(() => Session, (session) => session.driver)
	sessions: Session[];

	@OneToMany(() => SessionPassenger, (session) => session.passenger)
	rides: SessionPassenger[];

	@Column({ default: false })
	riding: boolean;

	@OneToOne(() => File, { nullable: true })
	@JoinColumn()
	picture: File;

	@ManyToMany(() => File)
	@JoinTable()
	files: File[];

	@Column({ default: false })
	online: boolean;

	currentToken: Token;

	getFullname() {
		return `${this.lastName}, ${this.firstName}`;
	}

	@BeforeRemove()
	async removeRelations() {
		await Token.createQueryBuilder('token')
			.where('userId = :userId', { userId: this.id })
			.delete()
			.execute();

		const fresh = await User.findOneOrFail(this.id, {
			relations: ['files', 'picture', 'rides', 'sessions', 'jeep'],
		});

		if (fresh.jeep) {
			fresh.jeep.driver = null;
			await fresh.jeep.save();
		}

		await fresh.picture?.remove();

		await Promise.all(fresh.files.map((file) => file.remove()));

		await Promise.all(fresh.rides.map((ride) => ride.remove()));

		await Promise.all(fresh.sessions.map((session) => session.remove()));
	}
}
