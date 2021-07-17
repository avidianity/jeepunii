import { forwardRef, Module } from '@nestjs/common';
import { JeepService } from './jeep.service';
import { JeepController } from './jeep.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { LogsModule } from 'src/logs/logs.module';
import { SocketService } from 'src/ws/socket.service';
import { AuthModule } from 'src/auth/auth.module';
import { DriversModule } from 'src/drivers/drivers.module';

@Module({
	providers: [JeepService, SocketService],
	controllers: [JeepController],
	imports: [
		CryptoModule,
		LogsModule,
		AuthModule,
		forwardRef(() => DriversModule),
	],
	exports: [JeepService],
})
export class JeepModule {}
