import { IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateCooperativeDTO {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	website?: string;

	@IsBoolean()
	@IsNotEmpty()
	@IsOptional()
	approved?: boolean;
}
