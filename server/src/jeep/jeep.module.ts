import { Module } from '@nestjs/common';
import { JeepService } from './jeep.service';
import { JeepController } from './jeep.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { LogsModule } from 'src/logs/logs.module';
import { DriversModule } from 'src/drivers/drivers.module';
import { SocketModule } from 'src/ws/socket.module';
import { LocationModule } from 'src/location/location.module';
import { UserModule } from 'src/user/user.module';

@Module({
	providers: [JeepService],
	controllers: [JeepController],
	imports: [
		CryptoModule,
		LogsModule,
		DriversModule,
		SocketModule,
		LocationModule,
		UserModule,
	],
	exports: [JeepService],
})
export class JeepModule {}
