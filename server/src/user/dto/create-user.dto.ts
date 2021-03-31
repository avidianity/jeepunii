import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsPhoneNumber,
	IsIn,
	IsNumber,
	IsOptional,
	IsBoolean,
} from 'class-validator';
import { Roles } from 'src/constants';
import { Cooperative } from 'src/models/cooperative.entity';
import { RolesEnum } from 'src/models/user.entity';
import { Exists } from 'src/validators';

export class CreateUserDTO {
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	address: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber('PH')
	phone: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsIn(Roles)
	role: RolesEnum;

	@IsNumber()
	@Exists(Cooperative)
	@IsOptional()
	cooperativeId?: number;

	@IsNumber()
	@IsOptional()
	coins?: number;

	@IsBoolean()
	@IsNotEmpty()
	approved: boolean;
}
