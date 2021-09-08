import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CooperativeModule } from './cooperative/cooperative.module';
import { JeepModule } from './jeep/jeep.module';
import { CryptoModule } from './crypto/crypto.module';
import { LogsModule } from './logs/logs.module';
import { DriversModule } from './drivers/drivers.module';
import { SocketModule } from './ws/socket.module';
import { MulterModule } from '@nestjs/platform-express';
import { Paths } from './constants';
import { diskStorage } from 'multer';
import { FileController } from './file/file.controller';
import { SessionModule } from './session/session.module';
import { LocationModule } from './location/location.module';
import { AnalyticsModule } from './analytics/analytics.module';
import mimeTypes from 'mime-types';
import { resolve } from 'path';

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
				cache: config.get('ENV') === 'production',
				extra: {
					decimalNumbers: true,
				},
				logger: 'file',
				logging: 'all',
			}),
			inject: [ConfigService],
		}),
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				storage: (() => {
					switch (config.get('STORAGE_ENGINE')) {
						case 'local':
							return diskStorage({
								destination: Paths.storage,
								filename: (
									_,
									{ fieldname, mimetype, filename },
									callback,
								) => {
									const extension =
										mimeTypes.extension(mimetype);
									if (!extension) {
										return callback(
											new Error('Invalid extension.'),
											filename,
										);
									}
									callback(
										null,
										`${fieldname}-${String.random(
											40,
										)}.${extension}`,
									);
								},
							});
						default:
							return diskStorage({
								destination: Paths.storage,
								filename: (
									_,
									{ fieldname, mimetype, filename },
									callback,
								) => {
									const extension =
										mimeTypes.extension(mimetype);
									if (!extension) {
										return callback(
											new Error('Invalid extension.'),
											filename,
										);
									}
									callback(
										null,
										`${fieldname}-${String.random(
											40,
										)}.${extension}`,
									);
								},
							});
					}
				})(),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		CryptoModule,
		LogsModule,
		UserModule,
		CooperativeModule,
		JeepModule,
		DriversModule,
		SocketModule,
		SessionModule,
		LocationModule,
		AnalyticsModule,
	],
	providers: [],
	exports: [],
	controllers: [FileController],
})
export class AppModule {}
