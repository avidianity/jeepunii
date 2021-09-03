import { Module } from '@nestjs/common';
import { JeepModule } from 'src/jeep/jeep.module';
import { LocationModule } from 'src/location/location.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { LogsModule } from 'src/logs/logs.module';

@Module({
	imports: [LocationModule, JeepModule, LogsModule],
	providers: [AnalyticsService],
	exports: [AnalyticsService],
	controllers: [AnalyticsController],
})
export class AnalyticsModule {}
