import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisService } from '@san-martin/san-martin-libs';

export async function createTestingModule(): Promise<TestingModule> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      ThrottlerModule.forRoot([{
        ttl: 60000,
        limit: 100,
      }]),
    ],
  })
    .overrideProvider(RedisService)
    .useValue({
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      setSmsCode: jest.fn(),
      getSmsCode: jest.fn(),
      delSmsCode: jest.fn(),
      setResetPasswordCode: jest.fn(),
      getResetPasswordCode: jest.fn(),
      delResetPasswordCode: jest.fn(),
    })
    .compile();

  const app = moduleFixture.createNestApplication();

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

  await app.init();

  return moduleFixture;
}

export const mockUser = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  roleId: 1,
  verified: true,
  phoneVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockAuthPayload = {
  sub: 1,
  email: 'test@example.com',
  roleId: 1,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
};

export const createMockJwtToken = (payload: any = mockAuthPayload): string => {
  return `mock-jwt-token-${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
};
