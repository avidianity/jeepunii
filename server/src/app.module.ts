import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CooperativeModule } from './cooperative/cooperative.module';
import { JeepModule } from './jeep/jeep.module';
import { CryptoModule } from './crypto/crypto.module';
import { LogsModule } from './logs/logs.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				type: config.get<any>('DB_CONNECTION'),
				host: config.get<string>('DB_HOST'),
				port: config.get<string>('DB_PORT'),
				username: config.get<string>('DB_USERNAME'),
				password: config.get<string>('DB_PASSWORD'),
				database: config.get<string>('DB_NAME'),
				entities: ['{dist, src}/models/*.entity.{js, ts}'],
				synchronize: config.get('ENV') !== 'production',
				cache: true,
				extra: {
					decimalNumbers: true,
				},
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
		CooperativeModule,
		JeepModule,
		CryptoModule,
		LogsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
