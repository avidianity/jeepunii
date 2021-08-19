import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Hash } from 'src/helpers';
import { Cooperative } from 'src/models/cooperative.entity';
import { Token } from 'src/models/token.entity';
import { User } from 'src/models/user.entity';
import { In } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { MD5 } from 'crypto-js';

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
			password: await Hash.makeAsync(data.password),
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

		user.approved = false;

		return await user.save();
	}

	async login(data: LoginDTO) {
		const user = await User.findOne(
			{
				email: data.email,
				role: In(data.roles),
			},
			{
				relations: ['cooperative', 'picture'],
			},
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

		if (!(await Hash.checkAsync(data.password, user.password))) {
			throw new ForbiddenException({
				message: 'The password entered is incorrect.',
			});
		}

		return user;
	}

	async validateHash(hash: string) {
		const token = await Token.findOne(
			{
				hash: MD5(hash).toString(),
			},
			{
				relations: [
					'user',
					'user.cooperative',
					'user.jeep',
					'user.picture',
				],
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
