import { Module } from '@nestjs/common';
import { PointModule } from './point/point.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
	controllers: [SessionController],
	providers: [SessionService],
	imports: [PointModule],
	exports: [PointModule],
})
export class SessionModule {}
