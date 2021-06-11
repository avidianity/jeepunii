import {
	BeforeRemove,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
} from 'typeorm';
import { Cooperative } from './cooperative.entity';
import { Jeep } from './jeep.entity';
import { Model } from './model.entity';
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

	currentToken: Token;

	getFullname() {
		return `${this.lastName}, ${this.firstName}`;
	}

	@BeforeRemove()
	async remoteTokens() {
		await Token.createQueryBuilder('token')
			.where('userId = :userId', { userId: this.id })
			.delete()
			.execute();
	}
}
