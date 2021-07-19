import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketService } from './socket.service';

@Module({
	providers: [SocketService],
	imports: [AuthModule],
	exports: [SocketService],
})
export class SocketModule {}
