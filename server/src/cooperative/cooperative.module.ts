import { Module } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CooperativeController } from './cooperative.controller';
import { LogsModule } from 'src/logs/logs.module';

@Module({
	providers: [CooperativeService],
	controllers: [CooperativeController],
	imports: [LogsModule],
	exports: [CooperativeService],
})
export class CooperativeModule {}
