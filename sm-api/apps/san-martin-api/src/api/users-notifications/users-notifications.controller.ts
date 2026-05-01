import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponseBody,
  FindManyNotificationsDto,
  NotificationsReadDto,
  RouteName,
  SetAppTokenDto,
  SuccessDto,
  UsersEntity,
  UsersRequest,
} from '@san-martin/san-martin-libs';

import { FindManyNotificationsResponseDto } from './dto/response/find-many-notifications.response.dto';
import { NotificationResponseDto } from './dto/response/notification.response.dto';
import { UsersNotificationsService } from './users-notifications.service';

@Controller(RouteName.USERS_NOTIFICATIONS)
@ApiTags('Notifications')
@ApiBearerAuth()
export class UsersNotificationsController {
  constructor(private service: UsersNotificationsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @Post('set-app-token')
  async setAppToken(
    @UsersRequest() { id }: UsersEntity,
    @Body() dto: SetAppTokenDto,
  ): Promise<SuccessDto> {
    return this.service.setAppToken(id, dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: FindManyNotificationsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Get()
  async notificationsList(
    @UsersRequest() { id }: UsersEntity,
    @Query() query: FindManyNotificationsDto,
  ) {
    const { rows, count } = await this.service.notificationsList(id, query);
    return {
      result: rows.map((notification) => new NotificationResponseDto(notification)),
      count,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @Post('read')
  async readNotification(
    @UsersRequest() { id }: UsersEntity,
    @Body() dto: NotificationsReadDto,
  ): Promise<SuccessDto> {
    return this.service.readNotification(id, dto);
  }
}
