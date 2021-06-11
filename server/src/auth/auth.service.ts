import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import md5 from 'md5';
import { Hash } from 'src/helpers';
import { Cooperative } from 'src/models/cooperative.entity';
import { Token } from 'src/models/token.entity';
import { User } from 'src/models/user.entity';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor() {}

	async register(data: RegisterDTO) {
		const count = await User.count({
			where: {
				email: data.email,
			},
		});

		if (count > 0) {
			throw new UnprocessableEntityException({
				errors: ['Email already exists.'],
			});
		}

		const user = new User();

		user.fill({
			...data,
			password: Hash.make(data.password),
		});

		if (data.cooperativeId) {
			const cooperative = await Cooperative.findOne(data.cooperativeId);
			if (!cooperative) {
				throw new NotFoundException({
					message: 'Cooperative does not exist.',
				});
			}
			user.cooperative = cooperative;
		}

		user.approved = ['Passenger', 'Admin'].includes(data.role);

		return await user.save();
	}

	async login(data: LoginDTO) {
		const user = await User.findOne(
			{
				email: data.email,
			},
			{ relations: ['cooperative'] },
		);

		if (!user) {
			throw new NotFoundException({
				message: 'Email does not exist.',
			});
		}

		if (!user.approved) {
			throw new ForbiddenException({
				message: 'Your account is not approved yet.',
			});
		}

		return user;
	}

	async validateHash(hash: string) {
		const token = await Token.findOne(
			{
				hash: md5(hash),
			},
			{
				relations: ['user', 'user.cooperative', 'user.jeep'],
			},
		);
		if (!token) {
			return null;
		}

		const user = new User().forceFill(token.user.toJSON());
		delete token.user;
		user.currentToken = token;
		return user;
	}
}
