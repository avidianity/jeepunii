import { IsNotEmpty, IsString } from 'class-validator';
import { CoordinatesDTO } from './coordinates.dto';

export class PassengerOutDTO extends CoordinatesDTO {
	@IsString()
	@IsNotEmpty()
	payload: string;
}
