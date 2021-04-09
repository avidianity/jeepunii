import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateCooperativeDTO {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	website: string;

	@IsBoolean()
	@IsNotEmpty()
	approved: boolean;
}
