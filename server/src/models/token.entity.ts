import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { User } from './user.entity';

@Entity()
export class Token extends Model {
	protected hidden = ['hash'];

	@Column()
	hash: string;

	@ManyToOne(() => User, (user) => user.tokens)
	user: User;
}
