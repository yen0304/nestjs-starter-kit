import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cors from 'cors';

import { AppModule } from './app.module';
import type { AllConfig } from './types/all-config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = 'api';
  const configService = app.get<ConfigService<AllConfig>>(ConfigService);
  const NODE_ENV = configService.get('app.NODE_ENV', { infer: true });
  Logger.log(`NODE_ENV = ${NODE_ENV}`);

  const whitelist = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.setGlobalPrefix(prefix);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle(`NestJS Starter Kit`)
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
      },
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
