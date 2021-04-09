import { Module } from '@nestjs/common';
import { LogsModule } from 'src/logs/logs.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [LogsModule],
	exports: [UserService],
})
export class UserModule {}
