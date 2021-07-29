import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import md5 from 'md5';
import { File } from 'src/models/file.entity';
import { Token } from 'src/models/token.entity';
import { RolesEnum } from 'src/models/user.entity';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { HttpBearerGuard } from './http-bearer.guard';

@Controller('auth')
export class AuthController {
	constructor(protected auth: AuthService) {}

	@Post('/register')
	async register(@Body() data: RegisterDTO) {
		const user = await this.auth.register(data);

		if (data.context === 'web' && user.role === RolesEnum.PASSENGER) {
			return { user };
		}

		const text = String.random();
		const token = new Token();
		token.hash = md5(text);
		token.user = user;
		await token.save();

		return {
			user,
			token: text,
		};
	}

	@Post('/register/passenger')
	@UseInterceptors(FilesInterceptor('files'))
	async registerPassenger(
		@Body() data: RegisterDTO,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		data.role = RolesEnum.PASSENGER;

		const user = await this.auth.register(data);

		user.files = await Promise.all(files.map((file) => File.process(file)));

		await user.save();

		return { user };
	}

	@Post('/login')
	async login(@Body() data: LoginDTO) {
		const user = await this.auth.login(data);
		const text = String.random(20);
		const token = new Token();
		token.hash = md5(text);
		token.user = user;
		await token.save();
		return {
			user,
			token: text,
		};
	}

	@Post('/logout')
	@UseGuards(HttpBearerGuard)
	async logout(@Req() request: Request) {
		const user = request.user;
		return await user.currentToken.remove();
	}

	@Get('/check')
	@UseGuards(HttpBearerGuard)
	check(@Req() request: Request) {
		return request.user;
	}
}
