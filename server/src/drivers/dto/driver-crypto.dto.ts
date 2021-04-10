import { IsNotEmpty, IsString } from 'class-validator';

export class DriverCryptoDTO {
	@IsString()
	@IsNotEmpty()
	payload: string;
}
