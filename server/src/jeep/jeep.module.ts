import { Module } from '@nestjs/common';
import { JeepService } from './jeep.service';
import { JeepController } from './jeep.controller';

@Module({
  providers: [JeepService],
  controllers: [JeepController]
})
export class JeepModule {}
