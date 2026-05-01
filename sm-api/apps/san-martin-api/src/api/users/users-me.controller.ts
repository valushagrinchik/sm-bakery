import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Platform,
  PlatformParam,
  RouteName,
  TransactionInspectors,
  TransactionParam,
  UsersEntity,
  UsersRequest,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { ChangePasswordDto } from './dto';
import { ChangeEmailDto } from './dto/request/change-email.dto';
import { ChangePhoneDto } from './dto/request/change-phone.dto';
import { UpdateUserVersionDto } from './dto/request/update-user-version.dto';
import { UserPhoneDto } from './dto/request/user-phone.dto';
import { UserSmsCodeDto } from './dto/request/user-sms-code.dto';
import { UsersMeUpdateDto } from './dto/request/users-me-update.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UsersService } from './users.service';

@ApiTags(RouteName.USERS)
@ApiBearerAuth()
@Controller(RouteName.USERS_ME)
export class UsersMeController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @Get()
  async getUsersMe(@UsersRequest() { id }: UsersEntity): Promise<UserResponseDto> {
    const user = await this.usersService.getUserMe(id);
    return new UserResponseDto(user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Put()
  @UseInterceptors(TransactionInspectors)
  async updateUsersMe(
    @TransactionParam() transaction: Transaction,
    @UsersRequest() { id }: UsersEntity,
    @Body() body: UsersMeUpdateDto,
  ): Promise<void> {
    await this.usersService.updateUsersMe(transaction, id, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete()
  @UseInterceptors(TransactionInspectors)
  async userMeDelete(
    @TransactionParam() transaction: Transaction,
    @UsersRequest() { id }: UsersEntity,
  ): Promise<void> {
    await this.usersService.delete(transaction, id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('send-verify-sms-code')
  async sendVerifySmsCode(@UsersRequest() { id }: UsersEntity): Promise<void> {
    await this.usersService.sendVerifySmsCode(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('verify-sms-code')
  async verifySmsCode(
    @UsersRequest() { id }: UsersEntity,
    @Body() body: UserSmsCodeDto,
  ): Promise<void> {
    await this.usersService.verifySmsCode(id, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('send-verify-sms-code-for-update-phone/:phoneNumber')
  async sendVerifySmsCodeForUpdatePhone(
    @PlatformParam() platform: Platform,
    @UsersRequest() { id }: UsersEntity,
    @Param() phoneNumber: UserPhoneDto,
  ): Promise<void> {
    await this.usersService.sendVerifySmsCodeForUpdatePhone(id, phoneNumber, platform);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('verify-sms-code-for-update-phone')
  async verifySmsCodeForUpdatePhone(
    @UsersRequest() { id }: UsersEntity,
    @Body() body: UserSmsCodeDto,
  ): Promise<void> {
    await this.usersService.verifySmsCodeForUpdatePhone(id, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('change-phone')
  async changePhone(
    @UsersRequest() { id }: UsersEntity,
    @Body() body: ChangePhoneDto,
  ): Promise<void> {
    await this.usersService.changePhone(id, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('send-verify-email-code-for-change-email/:email')
  async sendVerifyEmailCodeForChangeEmail(
    @PlatformParam() platform: Platform,
    @UsersRequest() { id }: UsersEntity,
    @Param('email') email: string,
  ): Promise<void> {
    await this.usersService.sendVerifyEmailCodeForChangeEmail(id, email, platform);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('update-version')
  async updateVersion(
    @PlatformParam() platform: Platform,
    @TransactionParam() transaction: Transaction,
    @UsersRequest() { id }: UsersEntity,
    @Body() body: UpdateUserVersionDto,
  ): Promise<void> {
    await this.usersService.updateVersion(transaction, id, body, platform);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('change-email')
  async changeEmail(
    @UsersRequest() { id }: UsersEntity,
    @Body() body: ChangeEmailDto,
  ): Promise<void> {
    await this.usersService.changeEmail(id, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('change-password')
  async changePassword(
    @UsersRequest() { id }: UsersEntity,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(id, body);
  }
}
