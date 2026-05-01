import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices/client';
import {
  AppConfigService,
  compareString,
  emailVerificationCodeValidityMinutes,
  ErrorMessageEnum,
  generateVerificationCode,
  hashString,
  MicroserviceChanelName,
  minutesToSeconds,
  OperationError,
  Platform,
  PlatformType,
  ProviderType,
  RedisService,
  resetPasswordCodeValidityMinutes,
  updateObject,
  UsersEntity,
  UserStatus,
} from '@san-martin/san-martin-libs';
import { OAuth2Client } from 'google-auth-library';
import { Transaction } from 'sequelize';
import verifyAppleToken from 'verify-apple-id-token';

import {
  EmailDto,
  JwtPayloadDto,
  JwtTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpCustomerDto,
  SocialAuthCommonDto,
  SocialCheckingExistenceDto,
  SocialSignInDto,
  SocialSignUpDto,
  VerifyEmailDto,
  VerifyResetPasswordCodeDto,
} from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MicroserviceChanelName.EMAIL_SERVICE) private emailService: ClientProxy,
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  public async checkingUserExistence(
    params: EmailDto,
    skipError?: boolean,
    transaction?: Transaction,
  ): Promise<UsersEntity> {
    const { email } = params;

    const user = await this.userService.findOneByEmail(email, false, transaction);

    if (user.customer?.sub) {
      throw new OperationError(ErrorMessageEnum.INVALID_AUTH_METHOD, HttpStatus.BAD_REQUEST);
    }

    if (!user.verified && !skipError) {
      throw new OperationError(ErrorMessageEnum.USER_IS_NOT_VERIFIED, HttpStatus.BAD_REQUEST);
    }

    if (user.status !== UserStatus.ACTIVE && !skipError) {
      throw new OperationError(ErrorMessageEnum.USER_IS_INACTIVE, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async userSignIn(
    transaction: Transaction,
    platform: Platform,
    dto: SignInDto,
  ): Promise<JwtTokenDto> {
    const { email, password } = dto;

    const user = await this.checkingUserExistence({ email }, false, transaction);

    if (user.customer?.sub) {
      throw new OperationError(ErrorMessageEnum.INVALID_AUTH_METHOD, HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await compareString(password, user.password);

    if (!isPasswordValid) {
      throw new OperationError(ErrorMessageEnum.INVALID_EMAIL_OR_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    const rolePermissionPlatform = {
      [Platform.AdminPanel]: user.role.adminPanelAccess,
      [Platform.OperatorApp]: user.role.operatorAppAccess,
      [Platform.CustomerApp]: user.role.customerAppAccess,
    };

    if (!rolePermissionPlatform[platform]) {
      throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
    }

    await user.update({ isOnline: true }, { transaction });

    const payload = { sub: user.id, roleId: user.roleId };

    return this.generateTokens(payload);
  }

  public async userRefreshToken(dto: JwtTokenDto): Promise<JwtTokenDto> {
    const payload = await this.jwtService.verifyAsync(dto.refreshToken).catch(() => {
      throw new UnauthorizedException();
    });

    if (dto.accessToken !== payload.accessToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneById(payload.sub);

    if (user.status !== UserStatus.ACTIVE) {
      throw new OperationError(ErrorMessageEnum.USER_IS_INACTIVE, HttpStatus.BAD_REQUEST);
    }

    // TODO: Add role to payload, while default customer
    const newPayload = { sub: user.id, roleId: 1 };

    return this.generateTokens(newPayload);
  }

  public async customerSignUp(
    transaction: Transaction,
    dto: SignUpCustomerDto,
    isNeedEmailVerification = true,
  ): Promise<UsersEntity> {
    const checkUser = await this.userService.findOneByEmail(dto.email, true, transaction);

    if (checkUser) {
      throw new OperationError(
        ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.password) {
      dto.password = await hashString(dto.password);
    }

    const createdUser = await this.userService.createCustomer(transaction, { ...dto });

    if (isNeedEmailVerification) {
      const emailVerificationCode = generateVerificationCode();

      const hashedEmailVerificationCode = await hashString(emailVerificationCode);

      await this.redisService.setVerificationEmailCode(
        createdUser.id,
        hashedEmailVerificationCode,
        minutesToSeconds(emailVerificationCodeValidityMinutes),
      );

      // TODO: Change based on template or something in the future.
      const emailPayload = {
        subject: `San Martin email verification.`,
        textContent: `Your email verification code is: ${emailVerificationCode}. It is code valid for 24 hours.`,
        to: [
          { email: createdUser.email, name: `${createdUser.firstName} ${createdUser.lastName}` },
        ],
      };

      this.emailService.emit('send-email', emailPayload);
    }

    return createdUser;
  }

  public async verifyEmail(transaction: Transaction, dto: VerifyEmailDto): Promise<void> {
    const { email, emailVerificationCode } = dto;

    const user = await this.userService.findOneByEmail(email);

    if (user.verified) {
      throw new OperationError(ErrorMessageEnum.USER_ALREADY_VERIFIED, HttpStatus.BAD_REQUEST);
    }

    if (!user.customer) {
      throw new OperationError(ErrorMessageEnum.CUSTOMER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const getCode = await this.redisService.getVerificationEmailCode(user.id);

    if (!getCode) {
      throw new OperationError(
        ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isVerifyCodeValid = await compareString(emailVerificationCode, getCode);

    if (!isVerifyCodeValid) {
      throw new OperationError(
        ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.redisService.delVerificationEmailCode(user.id);

    await user.update({ verified: true }, { transaction });
  }

  public async resendVerifyCode(params: EmailDto): Promise<void> {
    const { email } = params;

    const user = await this.userService.findOneByEmail(email);

    if (user.verified) {
      throw new OperationError(ErrorMessageEnum.USER_ALREADY_VERIFIED, HttpStatus.BAD_REQUEST);
    }

    if (!user.customer) {
      throw new OperationError(ErrorMessageEnum.CUSTOMER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const newEmailVerificationCode = generateVerificationCode();

    const hashedEmailVerificationCode = await hashString(newEmailVerificationCode);

    await this.redisService.setVerificationEmailCode(
      user.id,
      hashedEmailVerificationCode,
      minutesToSeconds(emailVerificationCodeValidityMinutes),
    );

    // TODO: Change based on template or something in the future.
    const emailPayload = {
      subject: `San Martin email verification.`,
      textContent: `Your email verification code is: ${newEmailVerificationCode}. This code is valid for 24 hours.`,
      to: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
    };

    this.emailService.emit('send-email', emailPayload);
  }

  public async sendResetPasswordCode(transaction: Transaction, params: EmailDto): Promise<void> {
    const { email } = params;

    const user = await this.userService.findOneByEmail(email, false, transaction);

    if (!user.verified) {
      throw new OperationError(ErrorMessageEnum.USER_IS_NOT_VERIFIED, HttpStatus.BAD_REQUEST);
    }

    const resetPasswordCode = generateVerificationCode();

    const hashedResetPasswordCode = await hashString(resetPasswordCode);

    await this.redisService.setResetPasswordCode(
      user.id,
      hashedResetPasswordCode,
      minutesToSeconds(resetPasswordCodeValidityMinutes),
    );

    // TODO: Change based on template or something in the future.
    const emailPayload = {
      subject: `San Martin reset password.`,
      textContent: `Your reset password code is: ${resetPasswordCode}. This code is valid for 15 minutes.`,
      to: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
    };

    this.emailService.emit('send-email', emailPayload);
  }

  public async verifyResetPasswordCode(dto: VerifyResetPasswordCodeDto): Promise<UsersEntity> {
    const { email, resetPasswordCode } = dto;

    const user = await this.userService.findOneByEmail(email);

    if (!user.verified) {
      throw new OperationError(ErrorMessageEnum.USER_IS_NOT_VERIFIED, HttpStatus.BAD_REQUEST);
    }

    const getCode = await this.redisService.getResetPasswordCode(user.id);

    if (!getCode) {
      throw new OperationError(ErrorMessageEnum.RESET_CODE_IS_NOT_VALID, HttpStatus.BAD_REQUEST);
    }

    const isResetCodeValid = await compareString(resetPasswordCode, getCode);

    if (!isResetCodeValid) {
      throw new OperationError(ErrorMessageEnum.RESET_CODE_IS_NOT_VALID, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async resetPassword(transaction: Transaction, dto: ResetPasswordDto): Promise<void> {
    const { email, resetPasswordCode, newPassword } = dto;

    const user = await this.verifyResetPasswordCode({ email, resetPasswordCode });

    const hashedNewPassword = await hashString(newPassword);

    await this.redisService.delResetPasswordCode(user.id);

    await user.update({ password: hashedNewPassword }, { transaction });
  }

  public async socialCheckingExistence(
    transaction: Transaction,
    dto: SocialAuthCommonDto,
  ): Promise<SocialCheckingExistenceDto> {
    const { token, platformType, providerType, userInfo } = dto;

    const { isTokenValid, sub } = await this.socialAuthVerify(providerType, token, platformType);

    if (!isTokenValid) {
      throw new OperationError(ErrorMessageEnum.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }

    if (userInfo?.email) {
      const checkCustomer = await this.userService.findCustomerBySubAndEmail(
        sub,
        userInfo.email,
        true,
        transaction,
      );

      if (checkCustomer && checkCustomer.user) {
        const { user } = checkCustomer;

        return {
          ...dto,
          userInfo: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            countryId: user.countryId,
          },
          hasUser: true,
          isEmailVerified: user.verified,
        };
      }
    }

    const customer = await this.userService.findCustomerBySub(sub, true, transaction);

    if (!customer) {
      if (userInfo?.email) {
        const checkUser = await this.userService.findOneByEmail(userInfo?.email, true, transaction);

        if (checkUser) {
          throw new OperationError(ErrorMessageEnum.INVALID_AUTH_METHOD, HttpStatus.BAD_REQUEST);
        } else {
          await this.userService.createSocialCustomer(transaction, {
            authProvider: providerType,
            sub,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            countryId: userInfo.countryId,
            platformType: platformType,
          });

          return {
            ...dto,
            hasUser: false,
            isEmailVerified: false,
          };
        }
      } else {
        throw new OperationError(ErrorMessageEnum.USER_NOT_ENOUGH_DATA, HttpStatus.BAD_REQUEST);
      }
    } else if (!customer.user) {
      if (userInfo?.email || customer?.socialAuthData?.email) {
        const checkUser = await this.userService.findOneByEmail(
          userInfo?.email || customer?.socialAuthData?.email,
          true,
          transaction,
        );

        if (checkUser) {
          throw new OperationError(ErrorMessageEnum.INVALID_AUTH_METHOD, HttpStatus.BAD_REQUEST);
        } else {
          const updatedSocialAuthdata = updateObject(customer.socialAuthData, {
            ...userInfo,
            platformType,
          });

          await this.userService.updateCustomer(transaction, customer.id, {
            socialAuthData: updatedSocialAuthdata,
          });

          return {
            ...dto,
            userInfo: {
              email: updatedSocialAuthdata.email,
              firstName: updatedSocialAuthdata.firstName,
              lastName: updatedSocialAuthdata.lastName,
              countryId: updatedSocialAuthdata.countryId,
            },
            hasUser: false,
            isEmailVerified: false,
          };
        }
      } else {
        throw new OperationError(ErrorMessageEnum.USER_NOT_ENOUGH_DATA, HttpStatus.BAD_REQUEST);
      }
    } else {
      const { user } = customer;

      return {
        ...dto,
        userInfo: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          countryId: user.countryId,
        },
        hasUser: true,
        isEmailVerified: user.verified,
      };
    }
  }

  public async customerSocialSignIn(
    transaction: Transaction,
    headerPlatform: Platform,
    dto: SocialSignInDto,
  ): Promise<JwtTokenDto> {
    const { token, platformType, providerType } = dto;

    const { isTokenValid, sub } = await this.socialAuthVerify(providerType, token, platformType);

    if (!isTokenValid) {
      throw new UnauthorizedException();
    }

    const checkCustomer = await this.userService.findCustomerBySub(sub, false, transaction);

    const { user } = checkCustomer;

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (!user.verified) {
      throw new OperationError(ErrorMessageEnum.USER_IS_NOT_VERIFIED, HttpStatus.BAD_REQUEST);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new OperationError(ErrorMessageEnum.USER_IS_INACTIVE, HttpStatus.BAD_REQUEST);
    }

    const rolePermissionPlatform = {
      [Platform.AdminPanel]: user.role.adminPanelAccess,
      [Platform.OperatorApp]: user.role.operatorAppAccess,
      [Platform.CustomerApp]: user.role.customerAppAccess,
    };

    if (!rolePermissionPlatform[headerPlatform]) {
      throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
    }

    const userForUpdate = await this.userService.findOneByEmail(user.email, false, transaction);

    await userForUpdate.update({ isOnline: true }, { transaction });

    const newPayload = { sub: user.id, roleId: user.roleId };

    return this.generateTokens(newPayload);
  }

  public async customerSocialSignUp(
    transaction: Transaction,
    dto: SocialSignUpDto,
  ): Promise<SocialSignInDto> {
    const { token, platformType, providerType, userInfo, isNeedEmailVerification } = dto;

    const { isTokenValid, sub } = await this.socialAuthVerify(providerType, token, platformType);

    if (!isTokenValid) {
      throw new OperationError(ErrorMessageEnum.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }

    const customer = await this.userService.findCustomerBySub(sub, false, transaction);

    if (customer.user) {
      throw new OperationError(ErrorMessageEnum.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    if (userInfo.email || customer.socialAuthData?.email) {
      const checkUser = await this.userService.findOneByEmail(
        userInfo.email || customer.socialAuthData?.email,
        true,
        transaction,
      );

      if (checkUser) {
        throw new OperationError(ErrorMessageEnum.INVALID_AUTH_METHOD, HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new OperationError(ErrorMessageEnum.USER_NOT_ENOUGH_DATA, HttpStatus.BAD_REQUEST);
    }

    const createdUser = await this.userService.createSocialUser(transaction, {
      sub,
      authProvider: providerType,
      firstName: customer.socialAuthData?.firstName,
      lastName: customer.socialAuthData?.lastName,
      email: customer.socialAuthData?.email,
      countryId: customer.socialAuthData?.countryId,
    });

    if (isNeedEmailVerification) {
      const emailVerificationCode = generateVerificationCode();

      const hashedEmailVerificationCode = await hashString(emailVerificationCode);

      await this.redisService.setVerificationEmailCode(
        createdUser.id,
        hashedEmailVerificationCode,
        minutesToSeconds(emailVerificationCodeValidityMinutes),
      );

      // TODO: Change based on template or something in the future.
      const emailPayload = {
        subject: `San Martin email verification.`,
        textContent: `Your email verification code is: ${emailVerificationCode}. It is code valid for 24 hours.`,
        to: [
          { email: createdUser.email, name: `${createdUser.firstName} ${createdUser.lastName}` },
        ],
      };

      this.emailService.emit('send-email', emailPayload);
    } else {
      await createdUser.update({ verified: true }, { transaction });
    }

    return { token, platformType, providerType };
  }

  public async socialAuthVerify(
    provider: ProviderType,
    token: string,
    platform: PlatformType,
  ): Promise<{ isTokenValid: boolean; sub: string }> {
    switch (provider) {
      case ProviderType.GOOGLE:
        return await this.verifyGoogleToken(token, platform);
      case ProviderType.APPLE:
        return await this.verifyAppleToken(token);
      case ProviderType.FACEBOOK:
        // TODO: Replace after fix facebook error
        return { isTokenValid: false, sub: '' };
      //   return await this.verifyFacebookToken(token);
    }
  }

  private async verifyGoogleToken(
    token: string,
    platform: PlatformType,
  ): Promise<{ isTokenValid: boolean; sub: string }> {
    try {
      const { googleClientIdAndroid, googleClientIdIOS } = this.appConfigService.socialAuth;

      const clientId =
        platform === PlatformType.ANDROID ? googleClientIdAndroid : googleClientIdIOS;

      const client = new OAuth2Client(clientId);

      const loginTicket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });

      const { sub, email, given_name, family_name } = loginTicket.getPayload();

      if (!email || !given_name || !family_name) {
        throw new OperationError(ErrorMessageEnum.USER_NOT_ENOUGH_DATA, HttpStatus.BAD_REQUEST);
      }

      return { isTokenValid: true, sub };
    } catch (error) {
      console.log('Google verify token error: ', error);
      throw new OperationError(ErrorMessageEnum.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyAppleToken(token: string): Promise<{ isTokenValid: boolean; sub: string }> {
    try {
      const { appleClientId } = this.appConfigService.socialAuth;

      const { sub } = await verifyAppleToken({
        idToken: token,
        clientId: appleClientId,
      });

      return { isTokenValid: true, sub };
    } catch (error) {
      console.log('Apple verify token error: ', error);
      throw new OperationError(ErrorMessageEnum.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyFacebookToken(token: string): Promise<boolean> {
    console.log('Facebook Token:', token);
    try {
      // TODO: Fix error with Facebook requests
      // TODO: Add to env FACEBOOK_ME_URL - https://graph.facebook.com/me
      // const facebookData = await axios.get(`https://graph.facebook.com/me?access_token=${token}`);
      // const facebookData = await axios.get(`${process.env.FACEBOOK_ME_URL}?access_token=${token}`);

      return true;
    } catch (error) {
      console.log('Facebook verify token error: ', error);
      throw new OperationError(ErrorMessageEnum.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }
  }

  public generateTokens(payload: JwtPayloadDto): JwtTokenDto {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
    });

    const refreshPayload = { ...payload, accessToken };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.appConfigService.jwtSecret,
    });

    return { accessToken, refreshToken };
  }
}
