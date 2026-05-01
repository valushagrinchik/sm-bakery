import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TransactionInspectors } from '@san-martin/san-martin-libs';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    checkingUserExistence: jest.fn(),
    userSignIn: jest.fn(),
    userRefreshToken: jest.fn(),
    customerSignUp: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerifyCode: jest.fn(),
    sendResetPasswordCode: jest.fn(),
    verifyResetPasswordCode: jest.fn(),
    resetPassword: jest.fn(),
    customerSocialSignIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideInterceptor(TransactionInspectors)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
