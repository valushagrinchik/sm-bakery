import * as process from 'node:process';

import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter, AwsService } from '@san-martin/san-martin-libs';

import { AppModule } from './app.module';
import { initSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: false });

  app.set('trust proxy', true);

  app.disable('x-powered-by');

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost), app.get(AwsService)));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), {}));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
  });

  app.enableShutdownHooks();

  initSwagger(app);

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
