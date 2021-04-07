import { Module } from '@nestjs/common';
import { JeepService } from './jeep.service';
import { JeepController } from './jeep.controller';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
	providers: [JeepService],
	controllers: [JeepController],
	imports: [CryptoModule],
})
export class JeepModule {}
