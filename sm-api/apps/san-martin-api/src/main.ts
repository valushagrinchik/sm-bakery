import * as process from 'node:process';
import * as compression from 'compression';
import helmet from 'helmet';

import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter, AwsService } from '@san-martin/san-martin-libs';

import { AppModule } from './app.module';
import { performanceMiddleware } from './common/middleware/performance.middleware';
import { initSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: false });

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Compression middleware
  app.use(compression());

  // Performance monitoring middleware
  app.use(performanceMiddleware);

  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // Global filters and interceptors
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost), app.get(AwsService)));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), {}));

  // Enhanced validation pipe
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

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
  });

  // Enhanced CORS configuration
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.enableShutdownHooks();
  initSwagger(app);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
