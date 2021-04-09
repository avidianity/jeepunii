import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpBearerStrategy } from './http-bearer.strategy';

@Module({
	imports: [PassportModule],
	controllers: [AuthController],
	providers: [AuthService, HttpBearerStrategy],
	exports: [AuthService],
})
export class AuthModule {}
