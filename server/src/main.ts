import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import './shims';
import { AppModule } from './app.module';
import { SocketService } from './ws/socket.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const server = app.getHttpServer();

	const socketService = app.get(SocketService);

	socketService.setup(server);

	app.use(urlencoded({ extended: true }));
	app.use(json());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors({
		credentials: true,
		origin: (origin, callback) => callback(null, origin),
	});

	const config = new DocumentBuilder()
		.setTitle('Jeepunii')
		.setDescription('The Jeepunii API Server')
		.setVersion('1.0')
		.addTag('payment, jeep, transportation')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	const port = process.env.PORT || 8000;

	await app.listen(port, async () =>
		console.log(`Listening to ${await app.getUrl()}`),
	);
}
bootstrap().catch((error) => console.error(error));
