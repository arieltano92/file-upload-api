import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('File Upload API')
    .setDescription('API for managing file uploads and metadata')
    .setVersion('1.0')
    .addBearerAuth() // Si vas a usar JWT luego
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete properties not declared into DTO
      forbidNonWhitelisted: true, // throw error with not allowed props
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
