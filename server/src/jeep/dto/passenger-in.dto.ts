import { IsNotEmpty, IsString } from 'class-validator';
import { CoordinatesDTO } from './coordinates.dto';

export class PassengerInDTO extends CoordinatesDTO {
	@IsString()
	@IsNotEmpty()
	payload: string;
}
