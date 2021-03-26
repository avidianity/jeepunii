import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';

@Injectable()
export class HttpBearerStrategy extends PassportStrategy(
	Strategy,
	'http-bearer',
) {
	constructor(protected auth: AuthService) {
		super();
	}

	async validate(hash: string) {
		const user = await this.auth.validateHash(hash);

		if (!user) {
			throw new UnauthorizedException({
				message: 'Action is unauthorized.',
			});
		}

		return user;
	}
}
