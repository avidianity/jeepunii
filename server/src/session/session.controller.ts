import { Controller, Get, Param } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
	constructor(protected session: SessionService) {}

	@Get('/:id')
	async show(@Param('id') id: number) {
		return await this.session.find(id);
	}
}
