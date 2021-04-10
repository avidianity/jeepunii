import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { LogsModule } from 'src/logs/logs.module';
import { JeepModule } from 'src/jeep/jeep.module';
import { UserModule } from 'src/user/user.module';

@Module({
	providers: [DriversService],
	controllers: [DriversController],
	imports: [CryptoModule, LogsModule, JeepModule, UserModule],
})
export class DriversModule {}
