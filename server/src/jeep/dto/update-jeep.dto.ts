import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Cooperative } from 'src/models/cooperative.entity';
import { User } from 'src/models/user.entity';
import { Exists } from 'src/validators';

export class UpdateJeepDTO {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	plateNumber?: string;

	@Exists(Cooperative)
	@IsOptional()
	cooperativeId?: number;

	@Exists(User)
	@IsOptional()
	driverId?: number;
}
