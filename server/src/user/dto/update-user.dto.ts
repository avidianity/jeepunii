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

export class UpdateUserDTO {
	@IsString()
	@IsOptional()
	firstName?: string;

	@IsString()
	@IsOptional()
	lastName?: string;

	@IsString()
	@IsOptional()
	address?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsPhoneNumber('PH')
	@IsOptional()
	phone?: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsString()
	@IsIn(Roles)
	@IsOptional()
	role?: RolesEnum;

	@IsNumber()
	@Exists(Cooperative)
	@IsOptional()
	cooperativeId?: number;

	@IsBoolean()
	@IsOptional()
	approved?: boolean;
}
