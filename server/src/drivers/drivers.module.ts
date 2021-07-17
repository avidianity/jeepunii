import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { LogsModule } from 'src/logs/logs.module';
import { UserModule } from 'src/user/user.module';
import { JeepModule } from 'src/jeep/jeep.module';

@Module({
	providers: [DriversService],
	controllers: [DriversController],
	imports: [
		CryptoModule,
		LogsModule,
		UserModule,
		forwardRef(() => JeepModule),
	],
	exports: [DriversService],
})
export class DriversModule {}
