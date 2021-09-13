import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import './shims';
import { AppModule } from './app.module';
import { SocketService } from './ws/socket.service';
import { RolesEnum, User } from './models/user.entity';
import { Hash } from './helpers';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const server = app.getHttpServer();

	const socketService = app.get(SocketService);

	socketService.setup(server);

	app.use(urlencoded({ extended: true }));
	app.use(json());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalFilters(new EntityNotFoundFilter());
	app.enableCors({
		credentials: true,
		origin: (origin, callback) => callback(null, origin),
	});

	const port = process.env.PORT || 8000;

	await app.listen(port, async () => {
		console.log(`Listening to ${await app.getUrl()}`);
		if ((await User.count({ where: { role: RolesEnum.ADMIN } })) === 0) {
			await new User()
				.fill({
					firstName: 'admin',
					lastName: 'admin',
					address: 'admin',
					email: 'admin@gmail.com',
					phone: '09382753825',
					password: await Hash.makeAsync('admin'),
					role: RolesEnum.ADMIN,
					approved: true,
					coins: 0,
				})
				.save();
		}
	});
}
bootstrap().catch((error) => console.error(error));
