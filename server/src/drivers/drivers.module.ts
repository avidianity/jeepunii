import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { LogsModule } from 'src/logs/logs.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { SocketModule } from 'src/ws/socket.module';

@Module({
	providers: [DriversService],
	controllers: [DriversController],
	imports: [CryptoModule, LogsModule, UserModule, AuthModule, SocketModule],
	exports: [DriversService],
})
export class DriversModule {}
