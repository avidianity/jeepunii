import { Module } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CooperativeController } from './cooperative.controller';

@Module({
  providers: [CooperativeService],
  controllers: [CooperativeController]
})
export class CooperativeModule {}
