import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import {join} from 'path';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationException } from './validationException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory: (errors) => {
  //       return new ValidationException(errors);
  //     },
  //     transform: true,
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new ValidationException(errors);
      },
      transform: true,
      whitelist: true, // Only allow properties defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if extra properties are provided
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ndisync')
    .setDescription('API Documentation for ndisync')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Input your JWT token',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  app.use('/public', express.static(join(__dirname, '..', 'public')));


  app.enableCors();

  app.use('/public', express.static(join(__dirname, '..', 'public')));

  await app.listen(80);
}
bootstrap();
