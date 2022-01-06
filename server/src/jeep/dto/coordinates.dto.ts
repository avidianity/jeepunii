import { IsLatitude, IsLongitude } from 'class-validator';

export class CoordinatesDTO {
	@IsLatitude()
	lat: number;

	@IsLongitude()
	lon: number;
}
