import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import './shims';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	console.log('haha');
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Paymento')
		.setDescription('The Paymento API Server')
		.setVersion('1.0')
		.addTag('payment, jeep, transportation')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	await app.listen(process.env.PORT || 3000, () =>
		console.log(`Listenting to ${process.env.PORT || 3000}`),
	);
}
bootstrap().catch((error) => console.error(error));
