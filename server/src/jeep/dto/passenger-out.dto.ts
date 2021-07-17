import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class PassengerOutDTO {
	@IsString()
	@IsNotEmpty()
	payload: string;

	@IsLatitude()
	lat: number;

	@IsLongitude()
	lon: number;
}
