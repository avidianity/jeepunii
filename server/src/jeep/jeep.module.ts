import { Module } from '@nestjs/common';
import { JeepService } from './jeep.service';
import { JeepController } from './jeep.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { LogsModule } from 'src/logs/logs.module';

@Module({
	providers: [JeepService],
	controllers: [JeepController],
	imports: [CryptoModule, LogsModule],
	exports: [JeepService],
})
export class JeepModule {}
