import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponseBody,
  FindOneParamsDto,
  RouteName,
  TransactionInspectors,
  TransactionParam,
  UsersEntity,
  UsersRequest,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { UserMeAddressQueryDto } from './dto/request/user-me-address.query.dto';
import { UsersMeAddressCreateDto } from './dto/request/users-me-address.create.dto';
import { UsersMeAddressUpdateDto } from './dto/request/users-me-address.update.dto';
import { UsersAddressResponseDto } from './dto/response/users-address.response.dto';
import { UsersMeAddressFindManyResponseDto } from './dto/response/users-me-address-find-many.response.dto';
import { UsersAddressService } from './users-address.service';

@Controller(RouteName.USERS_ME_ADDRESS)
@ApiTags(RouteName.USERS)
@ApiBearerAuth()
export class UsersMeAddressController {
  constructor(private readonly usersAddressService: UsersAddressService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UsersAddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post()
  @UseInterceptors(TransactionInspectors)
  async createUserMeAddress(
    @TransactionParam() transaction: Transaction,
    @UsersRequest() { id }: UsersEntity,
    @Body() body: UsersMeAddressCreateDto,
  ) {
    const userAddress = await this.usersAddressService.createUserMeAddress(transaction, id, body);
    return new UsersAddressResponseDto(userAddress);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: UsersMeAddressFindManyResponseDto,
  })
  @Get()
  async getUserMeAddressLists(
    @UsersRequest() { id: userMeId }: UsersEntity,
    @Query() query: UserMeAddressQueryDto,
  ): Promise<UsersMeAddressFindManyResponseDto> {
    return this.usersAddressService.getUserMeAddressLists(userMeId, query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: UsersAddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @Get(':id')
  async getUserMeAddress(
    @UsersRequest() { id: userMeId }: UsersEntity,
    @Param() { id: userAddressId }: FindOneParamsDto,
  ) {
    const userAddress = await this.usersAddressService.getUserMeAddress(userMeId, userAddressId);

    return new UsersAddressResponseDto(userAddress);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Put(':id')
  @UseInterceptors(TransactionInspectors)
  async updateUserMeAddress(
    @TransactionParam() transaction: Transaction,
    @UsersRequest() { id: userMeId }: UsersEntity,
    @Param() { id: userAddressId }: FindOneParamsDto,
    @Body() body: UsersMeAddressUpdateDto,
  ) {
    await this.usersAddressService.updateUserMeAddress(transaction, userMeId, userAddressId, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Delete(':id')
  @UseInterceptors(TransactionInspectors)
  async deleteUserMeAddress(
    @TransactionParam() transaction: Transaction,
    @UsersRequest() { id: userMeId }: UsersEntity,
    @Param() { id: userAddressId }: FindOneParamsDto,
  ) {
    await this.usersAddressService.deleteUserMeAddress(transaction, userMeId, userAddressId);
  }
}
