import { IsLatitude, IsLongitude } from 'class-validator';

export class InfoDTO {
	@IsLatitude()
	lat: number;

	@IsLongitude()
	lon: number;
}
