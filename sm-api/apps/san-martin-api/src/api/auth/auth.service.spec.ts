import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigService,
  compareString,
  ErrorMessageEnum,
  generateVerificationCode,
  hashString,
  OperationError,
  Platform,
  PlatformType,
  ProviderType,
  RedisService,
  TransactionInspectors,
  UserStatus,
} from '@san-martin/san-martin-libs';
import { Sequelize, Transaction } from 'sequelize';

import { AuthService } from './auth.service';
import { SignUpCustomerDto } from './dto';
import { UsersService } from '../users/users.service';

jest.mock('@san-martin/san-martin-libs', () => ({
  ...jest.requireActual('@san-martin/san-martin-libs'),
  compareString: jest.fn(),
  generateVerificationCode: jest.fn(),
  hashString: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let sequelize: Sequelize;
  let transaction: Transaction;

  const mockUserService = {
    findCustomerBySub: jest.fn(),
    findCustomerBySubAndEmail: jest.fn(),
    findOneByEmail: jest.fn(),
    createCustomer: jest.fn(),
    findOneById: jest.fn(),
    createSocialCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    createSocialUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockAppConfigService = {
    jwtSecret: 'mock-secret',
  };

  const mockEmailService = {
    emit: jest.fn(),
  };

  const mockTransactionInspectors = {
    inspect: jest.fn(),
  };

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  const mockRedis = {
    setVerificationEmailCode: jest.fn(),
    getVerificationEmailCode: jest.fn(),
    delVerificationEmailCode: jest.fn(),
    setResetPasswordCode: jest.fn(),
    getResetPasswordCode: jest.fn(),
    delResetPasswordCode: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AppConfigService, useValue: mockAppConfigService },
        { provide: 'email-service', useValue: mockEmailService },
        { provide: TransactionInspectors, useValue: mockTransactionInspectors },
        {
          provide: Sequelize,
          useValue: {
            transaction: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    sequelize = module.get<Sequelize>(Sequelize);

    transaction = await sequelize.transaction();

    jest.spyOn(service, 'socialAuthVerify').mockResolvedValue({
      isTokenValid: true,
      sub: 'test-sub',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkingUserExistence', () => {
    it('should return the user if found and verified', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        verified: true,
        status: UserStatus.ACTIVE,
      };
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      const result = await service.checkingUserExistence({ email: mockUser.email });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if the user is not verified', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        verified: false,
        status: UserStatus.ACTIVE,
      };
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockRedis.getVerificationEmailCode.mockResolvedValue('reset-code');

      try {
        await service.checkingUserExistence({ email: mockUser.email });

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_NOT_VERIFIED);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if the user is inactive', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        verified: true,
        status: UserStatus.BLOCKED,
      };
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      try {
        await service.checkingUserExistence({ email: mockUser.email });

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_INACTIVE);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('userSignIn', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      verified: true,
      status: UserStatus.ACTIVE,
      password: 'hashedPassword',
      roleId: 5,
      role: {
        id: 5,
        name: 'Customer',
        isDefault: true,
        customerAppAccess: true,
        operatorAppAccess: false,
        adminPanelAccess: false,
      },
      update: () => {},
    };

    const mockSignInPayload = { email: 'test@example.com', password: 'password' };

    it('should successfully sign in the user and return tokens', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      (compareString as jest.Mock).mockResolvedValue(true);

      service.generateTokens = jest.fn().mockReturnValue({
        accessToken: 'mockJwtToken',
        refreshToken: 'mockJwtToken',
      });

      const result = await service.userSignIn(transaction, Platform.CustomerApp, mockSignInPayload);

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockSignInPayload.email,
        false,
        transaction,
      );
      expect(result).toEqual({
        accessToken: 'mockJwtToken',
        refreshToken: 'mockJwtToken',
      });
    });

    it('should throw an error if the password is incorrect', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (compareString as jest.Mock).mockResolvedValue(false);

      try {
        await service.userSignIn(transaction, Platform.CustomerApp, mockSignInPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.INVALID_EMAIL_OR_PASSWORD);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if the user is inactive', async () => {
      const inactiveUser = { ...mockUser, status: UserStatus.BLOCKED };
      mockUserService.findOneByEmail.mockResolvedValue(inactiveUser);

      try {
        await service.userSignIn(transaction, Platform.CustomerApp, mockSignInPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_INACTIVE);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if the user is not verified', async () => {
      const unverifiedUser = { ...mockUser, verified: false };
      mockUserService.findOneByEmail.mockResolvedValue(unverifiedUser);

      try {
        await service.userSignIn(transaction, Platform.CustomerApp, mockSignInPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_NOT_VERIFIED);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('userRefreshToken', () => {
    it('should return new tokens if refresh token is valid and access token matches', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        status: UserStatus.ACTIVE,
      };
      const mockRefreshToken = 'mockRefreshToken';
      const mockAccessToken = 'mockAccessToken';

      const mockPayload = { sub: mockUser.id, accessToken: mockAccessToken };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      mockUserService.findOneById.mockResolvedValue(mockUser);

      service.generateTokens = jest.fn().mockReturnValue({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      const result = await service.userRefreshToken({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(mockPayload.sub);
      expect(service.generateTokens).toHaveBeenCalledWith({
        sub: mockUser.id,
        roleId: 1,
      });

      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const mockRefreshToken = 'invalidRefreshToken';

      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      try {
        await service.userRefreshToken({
          accessToken: 'anyAccessToken',
          refreshToken: mockRefreshToken,
        });

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error.status).toBe(401);
      }
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken);
    });

    it('should throw UnauthorizedException if access token does not match', async () => {
      const mockRefreshToken = 'validRefreshToken';
      const mockPayload = { sub: 1, accessToken: 'differentAccessToken' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      try {
        await service.userRefreshToken({
          accessToken: 'wrongAccessToken',
          refreshToken: mockRefreshToken,
        });

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error.status).toBe(401);
      }

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken);
    });

    it('should throw OperationError if the user is inactive', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        status: UserStatus.BLOCKED,
      };
      const mockPayload = { sub: mockUser.id, accessToken: 'mockAccessToken' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      mockUserService.findOneById.mockResolvedValue(mockUser);

      try {
        await service.userRefreshToken({
          accessToken: 'mockAccessToken',
          refreshToken: 'validRefreshToken',
        });

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_INACTIVE);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(mockUserService.findOneById).toHaveBeenCalledWith(mockPayload.sub);
    });
  });

  describe('customerSignUp', () => {
    const mockSignUpPayload: SignUpCustomerDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      phone: '+50221231234',
      countryId: 1,
    };

    it('should successfully sign up a new customer and send a verification email', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.createCustomer.mockResolvedValue({
        id: 1,
        email: mockSignUpPayload.email,
        firstName: mockSignUpPayload.firstName,
        lastName: mockSignUpPayload.lastName,
      });
      mockEmailService.emit.mockImplementation(jest.fn());

      await service.customerSignUp(transaction, mockSignUpPayload);

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockSignUpPayload.email,
        true,
        transaction,
      );
      expect(mockUserService.createCustomer).toHaveBeenCalledWith(
        transaction,
        expect.objectContaining({
          email: mockSignUpPayload.email,
          firstName: mockSignUpPayload.firstName,
          lastName: mockSignUpPayload.lastName,
        }),
      );
      expect(mockEmailService.emit).toHaveBeenCalled();
    });

    it('should throw an error if the user already exists', async () => {
      const existingUser = { email: 'test@example.com' };
      mockUserService.findOneByEmail.mockResolvedValue(existingUser);

      try {
        await service.customerSignUp(transaction, mockSignUpPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockSignUpPayload.email,
        true,
        transaction,
      );
    });
  });

  describe('verifyEmail', () => {
    const mockVerifyEmailPayload = {
      email: 'test@example.com',
      emailVerificationCode: 'hashed-code',
    };

    const mockUser = {
      id: 1,
      email: mockVerifyEmailPayload.email,
      verified: false,
      customer: {
        emailVerificationCode: mockVerifyEmailPayload.emailVerificationCode,
        emailVerificationCodeCreatedAt: new Date(),
        update: jest.fn(),
      },
      update: jest.fn(),
    };

    it('should successfully verify the email', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      (compareString as jest.Mock).mockResolvedValue(true);

      mockUser.update.mockResolvedValue({});
      mockUser.customer.update.mockResolvedValue({});

      await service.verifyEmail(transaction, mockVerifyEmailPayload);

      expect(mockUser.update).toHaveBeenCalledWith({ verified: true }, { transaction });
    });

    it('should throw an error if user is already verified', async () => {
      mockUser.verified = true;

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      try {
        await service.verifyEmail(transaction, mockVerifyEmailPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_ALREADY_VERIFIED);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if verification code is invalid', async () => {
      mockUser.verified = false;

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      (compareString as jest.Mock).mockResolvedValue(false);

      mockVerifyEmailPayload.emailVerificationCode = 'invalid-code';

      try {
        await service.verifyEmail(transaction, mockVerifyEmailPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('resendVerifyCode', () => {
    const mockResendVerifyCodePayload = {
      email: 'test@example.com',
    };

    const mockUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: mockResendVerifyCodePayload.email,
      verified: false,
      customer: {
        emailVerificationCode: 'hashed-code',
        update: jest.fn(),
      },
    };

    it('should resend the verification code successfully', async () => {
      const generatedCode = 'new_code';
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      mockEmailService.emit.mockImplementation(jest.fn());

      (generateVerificationCode as jest.Mock).mockResolvedValue(generatedCode);
      (hashString as jest.Mock).mockResolvedValue('new-hashed-code');

      await service.resendVerifyCode(mockResendVerifyCodePayload);

      expect(mockEmailService.emit).toHaveBeenCalled();
    });

    it('should throw an error if user is already verified', async () => {
      mockUser.verified = true;
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      try {
        await service.resendVerifyCode(mockResendVerifyCodePayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_ALREADY_VERIFIED);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('sendResetPasswordCode', () => {
    const mockSendResetPasswordPayload = {
      email: 'test@example.com',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      verified: true,
      status: UserStatus.ACTIVE,
      customer: {
        update: jest.fn(),
      },
      update: jest.fn(),
    };

    it('should send a reset password code successfully', async () => {
      const generatedCode = 'reset_code';
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      mockEmailService.emit.mockImplementation(jest.fn());

      (generateVerificationCode as jest.Mock).mockResolvedValue(generatedCode);
      (hashString as jest.Mock).mockResolvedValue('hashed-reset-code');

      await service.sendResetPasswordCode(transaction, mockSendResetPasswordPayload);

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockSendResetPasswordPayload.email,
        false,
        transaction,
      );

      expect(mockEmailService.emit).toHaveBeenCalled();
    });

    it('should throw an error if the user is inactive', async () => {
      mockUser.verified = false;
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockRedis.getResetPasswordCode.mockResolvedValue('reset-code');

      try {
        await service.sendResetPasswordCode(transaction, mockSendResetPasswordPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_NOT_VERIFIED);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('verifyResetPasswordCode', () => {
    const mockVerifyResetPasswordPayload = {
      email: 'test@example.com',
      resetPasswordCode: 'reset_code',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      verified: true,
      status: UserStatus.ACTIVE,
      resetPasswordCode: 'hashed-reset-code',
      resetPasswordCodeCreatedAt: new Date(),
      update: jest.fn(),
    };

    it('should successfully verify the reset password code', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (compareString as jest.Mock).mockResolvedValue(true);
      mockRedis.getResetPasswordCode.mockResolvedValue(mockUser.resetPasswordCode);

      await service.verifyResetPasswordCode(mockVerifyResetPasswordPayload);

      expect(compareString).toHaveBeenCalledWith(
        mockVerifyResetPasswordPayload.resetPasswordCode,
        mockUser.resetPasswordCode,
      );

      expect(mockUser).toHaveProperty('id');
      expect(mockUser.id).toBeDefined();
    });

    it('should throw an error if the reset code is incorrect', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (compareString as jest.Mock).mockResolvedValue(false);
      mockRedis.getResetPasswordCode.mockResolvedValue(mockUser.resetPasswordCode);

      try {
        await service.verifyResetPasswordCode(mockVerifyResetPasswordPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.RESET_CODE_IS_NOT_VALID);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockVerifyResetPasswordPayload.email,
      );
    });

    it('should throw an error if the user is not verified', async () => {
      const inactiveUser = { ...mockUser, verified: false };
      mockUserService.findOneByEmail.mockResolvedValue(inactiveUser);
      (compareString as jest.Mock).mockResolvedValue(true);
      mockRedis.getResetPasswordCode.mockResolvedValue(mockUser.resetPasswordCode);

      try {
        await service.verifyResetPasswordCode(mockVerifyResetPasswordPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_IS_NOT_VERIFIED);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockVerifyResetPasswordPayload.email,
      );
    });
  });

  describe('resetPassword', () => {
    const mockResetPasswordPayload = {
      email: 'test@example.com',
      newPassword: 'newPassword123',
      resetPasswordCode: 'resetCode',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      verified: true,
      status: UserStatus.ACTIVE,
      resetPasswordCode: 'hashed-reset-code',
      resetPasswordCodeCreatedAt: new Date(),
      update: jest.fn(),
    };

    it('should successfully reset the password', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (compareString as jest.Mock).mockResolvedValue(true);
      mockRedis.getResetPasswordCode.mockResolvedValue(mockUser.resetPasswordCode);

      await service.resetPassword(transaction, mockResetPasswordPayload);

      expect(compareString).toHaveBeenCalledWith(
        mockResetPasswordPayload.resetPasswordCode,
        mockUser.resetPasswordCode,
      );

      expect(mockUser.update).toHaveBeenCalledWith(
        expect.objectContaining({
          password: mockUser.resetPasswordCode,
        }),
        { transaction },
      );
    });

    it('should throw an error if the reset password code is incorrect', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (compareString as jest.Mock).mockResolvedValue(false);

      mockRedis.getResetPasswordCode.mockResolvedValue(mockUser.resetPasswordCode);

      try {
        await service.resetPassword(transaction, mockResetPasswordPayload);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.RESET_CODE_IS_NOT_VALID);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(compareString).toHaveBeenCalledWith(
        mockResetPasswordPayload.resetPasswordCode,
        mockUser.resetPasswordCode,
      );
    });
  });

  //

  describe('socialCheckingExistence', () => {
    const dto = {
      token: '<access_token>',
      platformType: PlatformType.IOS,
      providerType: ProviderType.APPLE,
      userInfo: {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test.test@test.com',
        countryId: 1,
      },
    };

    it('should throw an error if token is invalid', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: false,
        sub: 'test-sub',
      });

      await expect(service.socialCheckingExistence(transaction, dto)).rejects.toThrowError(
        new OperationError(ErrorMessageEnum.INVALID_TOKEN, 400),
      );
    });

    it('should return existing customer data when user exists by email and sub', async () => {
      mockUserService.findCustomerBySubAndEmail.mockResolvedValueOnce({
        user: {
          firstName: 'Test',
          lastName: 'Test',
          email: 'test.test@test.com',
          countryId: 1,
          verified: true,
        },
      });

      const result = await service.socialCheckingExistence(transaction, dto);

      expect(result).toEqual({
        ...dto,
        userInfo: {
          firstName: 'Test',
          lastName: 'Test',
          email: 'test.test@test.com',
          countryId: 1,
        },
        hasUser: true,
        isEmailVerified: true,
      });
    });

    it('should create a new user if no customer exists with the given sub', async () => {
      mockUserService.findCustomerBySub.mockResolvedValueOnce(null);
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);

      const result = await service.socialCheckingExistence(transaction, dto);

      expect(mockUserService.createSocialCustomer).toHaveBeenCalledWith(mockTransaction, {
        authProvider: dto.providerType,
        sub: 'test-sub',
        email: dto.userInfo.email,
        firstName: dto.userInfo.firstName,
        lastName: dto.userInfo.lastName,
        countryId: dto.userInfo.countryId,
        platformType: dto.platformType,
      });
      expect(result).toEqual({
        ...dto,
        hasUser: false,
        isEmailVerified: false,
      });
    });

    it('should update social auth data if customer exists but user is missing', async () => {
      mockUserService.findCustomerBySub.mockResolvedValueOnce({
        socialAuthData: {
          email: 'test2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      });
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);

      const result = await service.socialCheckingExistence(transaction, dto);

      expect(result).toEqual({
        ...dto,
        userInfo: {
          email: 'test.test@test.com',
          firstName: 'Test',
          lastName: 'Test',
          countryId: 1,
        },
        hasUser: false,
        isEmailVerified: false,
      });
    });

    it('should throw an error if userInfo lacks required data', async () => {
      dto.userInfo.email = null;

      await expect(service.socialCheckingExistence(transaction, dto)).rejects.toThrowError(
        new OperationError(ErrorMessageEnum.USER_NOT_ENOUGH_DATA, 400),
      );
    });
  });

  describe('customerSocialSignIn', () => {
    const dto = {
      token: '<access_token>',
      platformType: PlatformType.IOS,
      providerType: ProviderType.GOOGLE,
    };

    it('should throw an error if the token is invalid', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: false,
        sub: 'test-sub',
      });

      await expect(
        service.customerSocialSignIn(transaction, Platform.CustomerApp, dto),
      ).rejects.toThrowError(new UnauthorizedException());
    });

    it('should throw an error if user is not found', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      mockUserService.findCustomerBySub.mockResolvedValueOnce({ user: null });

      await expect(
        service.customerSocialSignIn(transaction, Platform.CustomerApp, dto),
      ).rejects.toThrowError(new OperationError(ErrorMessageEnum.USER_NOT_FOUND, 400));
    });

    it('should throw an error if user is not verified', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      mockUserService.findCustomerBySub.mockResolvedValueOnce({
        user: { verified: false },
      });

      await expect(
        service.customerSocialSignIn(transaction, Platform.CustomerApp, dto),
      ).rejects.toThrowError(new OperationError(ErrorMessageEnum.USER_IS_NOT_VERIFIED, 400));
    });

    it('should throw an error if user status is inactive', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      mockUserService.findCustomerBySub.mockResolvedValueOnce({
        user: { verified: true, status: UserStatus.BLOCKED },
      });

      await expect(
        service.customerSocialSignIn(transaction, Platform.CustomerApp, dto),
      ).rejects.toThrowError(new OperationError(ErrorMessageEnum.USER_IS_INACTIVE, 400));
    });

    it('should throw an error if user does not have permission for the platform', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      mockUserService.findCustomerBySub.mockResolvedValueOnce({
        user: {
          verified: true,
          status: UserStatus.ACTIVE,
          role: { customerAppAccess: false, operatorAppAccess: false, adminPanelAccess: true },
        },
      });

      await expect(
        service.customerSocialSignIn(transaction, Platform.CustomerApp, dto),
      ).rejects.toThrowError(new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, 400));
    });

    it('should return tokens if user meets all conditions', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      mockUserService.findCustomerBySub.mockResolvedValueOnce({
        user: {
          id: 'userId',
          verified: true,
          status: UserStatus.ACTIVE,
          role: { customerAppAccess: true, operatorAppAccess: false, adminPanelAccess: false },
        },
      });

      service.generateTokens = jest.fn().mockReturnValue({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      const result = await service.customerSocialSignIn(transaction, Platform.CustomerApp, dto);

      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });
  });

  describe('customerSocialSignUp', () => {
    const dto = {
      token: '<access_token>',
      platformType: PlatformType.IOS,
      providerType: ProviderType.GOOGLE,
      userInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
      },
      isNeedEmailVerification: true,
    };

    it('should throw an error if the token is invalid', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: false,
        sub: 'test-sub',
      });

      await expect(service.customerSocialSignUp(transaction, dto)).rejects.toThrowError(
        new OperationError(ErrorMessageEnum.INVALID_TOKEN, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if user already exists', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      const mockCustomer = { user: { id: 'existingUserId' } };
      mockUserService.findCustomerBySub.mockResolvedValueOnce(mockCustomer);

      await expect(service.customerSocialSignUp(transaction, dto)).rejects.toThrowError(
        new OperationError(ErrorMessageEnum.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if user email is already taken', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      const mockCustomer = { user: null, socialAuthData: { email: dto.userInfo.email } };
      mockUserService.findCustomerBySub.mockResolvedValueOnce(mockCustomer);
      mockUserService.findOneByEmail.mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(service.customerSocialSignUp(transaction, dto)).rejects.toThrowError(
        new OperationError(ErrorMessageEnum.INVALID_AUTH_METHOD, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if insufficient user data is provided', async () => {
      const invalidDto = { ...dto, userInfo: { ...dto.userInfo, email: null } };
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      const mockCustomer = { user: null };
      mockUserService.findCustomerBySub.mockResolvedValueOnce(mockCustomer);

      await expect(service.customerSocialSignUp(transaction, invalidDto)).rejects.toThrowError(
        new OperationError(ErrorMessageEnum.USER_NOT_ENOUGH_DATA, HttpStatus.BAD_REQUEST),
      );
    });

    it('should create a new social user and send email verification if required', async () => {
      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      const mockCustomer = {
        user: null,
        socialAuthData: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test.user@example.com',
          countryId: 1,
        },
      };
      mockUserService.findCustomerBySub.mockResolvedValueOnce(mockCustomer);
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);
      mockUserService.createSocialUser.mockResolvedValueOnce({
        id: 'newUserId',
        email: 'test.user@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      mockRedis.setVerificationEmailCode.mockResolvedValue('setVerificationEmailCode');
      mockEmailService.emit.mockImplementation(jest.fn());

      const result = await service.customerSocialSignUp(transaction, dto);

      expect(mockUserService.createSocialUser).toHaveBeenCalledWith(transaction, {
        sub: 'test-sub',
        authProvider: dto.providerType,
        firstName: mockCustomer.socialAuthData.firstName,
        lastName: mockCustomer.socialAuthData.lastName,
        email: mockCustomer.socialAuthData.email,
        countryId: mockCustomer.socialAuthData.countryId,
      });

      expect(mockEmailService.emit).toHaveBeenCalled();

      expect(result).toEqual({
        token: dto.token,
        platformType: dto.platformType,
        providerType: dto.providerType,
      });
    });

    it('should create a new user and mark as verified if email verification is not needed', async () => {
      const mockDto = { ...dto, isNeedEmailVerification: false };

      (service.socialAuthVerify as jest.Mock).mockResolvedValue({
        isTokenValid: true,
        sub: 'test-sub',
      });
      const mockCustomer = {
        user: null,
        socialAuthData: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test.user@example.com',
          countryId: 1,
        },
      };
      mockUserService.findCustomerBySub.mockResolvedValueOnce(mockCustomer);
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);
      const mockCreatedUser = { id: 'newUserId', update: jest.fn() };
      mockUserService.createSocialUser.mockResolvedValueOnce(mockCreatedUser);

      const result = await service.customerSocialSignUp(transaction, mockDto);

      expect(mockCreatedUser.update).toHaveBeenCalledWith({ verified: true }, { transaction });
      expect(result).toEqual({
        token: mockDto.token,
        platformType: mockDto.platformType,
        providerType: mockDto.providerType,
      });
    });
  });
});
