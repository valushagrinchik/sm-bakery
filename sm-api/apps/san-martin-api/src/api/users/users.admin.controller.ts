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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdmitPanelGuard,
  CreateUsersGuard,
  DeleteUsersGuard,
  FindOneParamsDto,
  RouteName,
  SuccessDto,
  TransactionInspectors,
  TransactionParam,
  UpdateUsersGuard,
  UsersEntity,
  UsersRequest,
  ViewUsersGuard,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { UsersAdminCreateDto, UsersAdminUpdateDto } from './dto';
import { FindManyUsersDto } from './dto/request/find-many-users.dto';
import { FindManyUsersResponseDto } from './dto/response/find-many-users.response.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UsersService } from './users.service';

@ApiTags(RouteName.USERS)
@ApiBearerAuth()
@UseGuards(AdmitPanelGuard)
@Controller(RouteName.ADMIN_USERS)
export class UsersAdminController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @UseGuards(CreateUsersGuard)
  @UseInterceptors(TransactionInspectors)
  @Post()
  async create(
    @TransactionParam() transaction: Transaction,
    @Body() body: UsersAdminCreateDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(transaction, body);
    return new UserResponseDto(user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(UpdateUsersGuard)
  @UseInterceptors(TransactionInspectors)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @TransactionParam() transaction: Transaction,
    @Body() body: UsersAdminUpdateDto,
  ): Promise<void> {
    await this.userService.update(transaction, id, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @UseGuards(ViewUsersGuard)
  @Get(':id')
  async find(@Param() { id }: FindOneParamsDto): Promise<UserResponseDto> {
    const user = await this.userService.getById(id);
    return new UserResponseDto(user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: FindManyUsersResponseDto,
  })
  @UseGuards(ViewUsersGuard)
  @Get()
  async getUsersList(
    @UsersRequest() userAuth: UsersEntity,
    @Query() query: FindManyUsersDto,
  ): Promise<FindManyUsersResponseDto> {
    return this.userService.getUsersList(query, userAuth);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(ViewUsersGuard)
  @Get(':id/resetPassword')
  async resetPassword(@Param() { id }: FindOneParamsDto): Promise<SuccessDto> {
    await this.userService.resetPassword(id);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @UseGuards(DeleteUsersGuard)
  @UseInterceptors(TransactionInspectors)
  @Delete(':id')
  async delete(
    @TransactionParam() transaction: Transaction,
    @Param('id') id: number,
  ): Promise<SuccessDto> {
    await this.userService.delete(transaction, id);
    return new SuccessDto({ message: 'ok' });
  }
}
