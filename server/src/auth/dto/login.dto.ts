import {
	ArrayNotEmpty,
	IsArray,
	IsEmail,
	IsIn,
	IsNotEmpty,
	IsString,
} from 'class-validator';
import { Roles } from 'src/constants';
import { RolesEnum } from 'src/models/user.entity';

export class LoginDTO {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsArray()
	@IsIn(Roles, { each: true })
	@ArrayNotEmpty()
	roles: RolesEnum[];
}
