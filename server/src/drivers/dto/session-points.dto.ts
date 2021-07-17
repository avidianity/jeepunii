import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { SessionPointDTO } from './session-point.dto';

export class SessionPointsDTO {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SessionPointDTO)
	data: SessionPointDTO[];
}
