import { IsLatitude, IsLongitude } from 'class-validator';

export class SessionPointDTO {
	@IsLatitude()
	lat: number;

	@IsLongitude()
	lon: number;
}
