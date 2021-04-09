import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Cooperative } from 'src/models/cooperative.entity';
import { User } from 'src/models/user.entity';
import { Exists } from 'src/validators';

export class CreateJeepDTO {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	plateNumber: string;

	@IsNotEmpty()
	@Exists(Cooperative)
	cooperativeId: number;

	@Exists(User)
	@IsOptional()
	driverId?: number;
}
