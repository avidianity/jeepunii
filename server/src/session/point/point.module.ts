import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PointController } from './point.controller';
import { PointService } from './point.service';

@Module({
	controllers: [PointController],
	providers: [PointService],
	exports: [PointService],
	imports: [UserModule],
})
export class PointModule {}
