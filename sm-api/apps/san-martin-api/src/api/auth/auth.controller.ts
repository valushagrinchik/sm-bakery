import { Body, Controller, Get, HttpStatus, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponseBody,
  Platform,
  PlatformParam,
  RouteName,
  TransactionInspectors,
  TransactionParam,
  UsersEntity,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { AuthService } from './auth.service';
import {
  EmailDto,
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

@ApiTags('Authentication')
@Controller(RouteName.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiParam({ type: String, name: 'email' })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Get('checking-user-existence/:email')
  async checkingUserExistence(@Param() params: EmailDto): Promise<void> {
    await this.authService.checkingUserExistence(params);
  }

  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: JwtTokenDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/sign-in')
  @UseInterceptors(TransactionInspectors)
  async userSignIn(
    @PlatformParam() platform: Platform,
    @TransactionParam() transaction: Transaction,
    @Body() dto: SignInDto,
  ): Promise<JwtTokenDto> {
    return this.authService.userSignIn(transaction, platform, dto);
  }

  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: JwtTokenDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/refresh')
  async userRefreshToken(@Body() dto: JwtTokenDto): Promise<JwtTokenDto> {
    return this.authService.userRefreshToken(dto);
  }

  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/customer/sign-up')
  @UseInterceptors(TransactionInspectors)
  async customerSignUp(
    @TransactionParam() transaction: Transaction,
    @Body() dto: SignUpCustomerDto,
  ): Promise<void> {
    await this.authService.customerSignUp(transaction, dto);
  }

  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/verify-email')
  @UseInterceptors(TransactionInspectors)
  async verifyEmail(
    @TransactionParam() transaction: Transaction,
    @Body() dto: VerifyEmailDto,
  ): Promise<void> {
    await this.authService.verifyEmail(transaction, dto);
  }

  @ApiParam({ type: String, name: 'email' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/resend-verification-code/:email')
  async resendVerifyCode(@Param() params: EmailDto): Promise<void> {
    await this.authService.resendVerifyCode(params);
  }

  @ApiParam({ type: String, name: 'email' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/send-reset-password-code/:email')
  @UseInterceptors(TransactionInspectors)
  async sendResetPasswordCode(
    @TransactionParam() transaction: Transaction,
    @Param() params: EmailDto,
  ): Promise<void> {
    await this.authService.sendResetPasswordCode(transaction, params);
  }

  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/verify-reset-password-code')
  async verifyResetPasswordCode(@Body() dto: VerifyResetPasswordCodeDto): Promise<void> {
    await this.authService.verifyResetPasswordCode(dto);
  }

  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: UsersEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/user/reset-password')
  @UseInterceptors(TransactionInspectors)
  async resetPassword(
    @TransactionParam() transaction: Transaction,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(transaction, dto);
  }

  @ApiOperation({
    summary: 'Social media registration',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/customer/social/checking-existence')
  @UseInterceptors(TransactionInspectors)
  async socialCheckingExistence(
    @TransactionParam() transaction: Transaction,
    @Body() dto: SocialAuthCommonDto,
  ): Promise<SocialCheckingExistenceDto> {
    return this.authService.socialCheckingExistence(transaction, dto);
  }

  @ApiOperation({
    summary: 'Social media authorization',
    description:
      'This module is designed to handle authorization through social media (Google, Apple, Facebook).',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: JwtTokenDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/customer/social/sign-in')
  @UseInterceptors(TransactionInspectors)
  async customerSocialSignIn(
    @PlatformParam() platform: Platform,
    @TransactionParam() transaction: Transaction,
    @Body() dto: SocialSignInDto,
  ): Promise<JwtTokenDto> {
    return this.authService.customerSocialSignIn(transaction, platform, dto);
  }

  @ApiOperation({
    summary: 'Social media registration',
    description:
      'This module is designed to handle registration through social media (Google, Apple, Facebook). Before running this query, please make sure to run the query /customer/social/checking-existence.',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: UsersEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('/customer/social/sign-up')
  @UseInterceptors(TransactionInspectors)
  async customerSocialSignUp(
    @TransactionParam() transaction: Transaction,
    @Body() dto: SocialSignUpDto,
  ): Promise<SocialSignInDto> {
    return this.authService.customerSocialSignUp(transaction, dto);
  }
}
