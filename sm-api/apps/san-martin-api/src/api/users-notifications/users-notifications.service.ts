import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MicroserviceChanelName,
  NotificationMicroserviceMessagePattern,
  NotificationsEntity,
  FindManyNotificationsDto,
  NotificationsReadDto,
  NotificationsSendDto,
  SetAppTokenDto,
  SuccessDto,
} from '@san-martin/san-martin-libs';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersNotificationsService {
  constructor(
    @Inject(MicroserviceChanelName.NOTIFICATION_SERVICE) private notificationService: ClientProxy,
  ) {}

  async setAppToken(userId: number, dto: SetAppTokenDto) {
    return this.send<SuccessDto, SetAppTokenDto>(
      NotificationMicroserviceMessagePattern.SET_APP_TOKEN,
      userId,
      dto,
    );
  }

  async notificationsList(userId: number, query: FindManyNotificationsDto) {
    return this.send<
      {
        rows: NotificationsEntity[];
        count: number;
      },
      FindManyNotificationsDto
    >(NotificationMicroserviceMessagePattern.GET_NOTIFICATIONS, userId, query);
  }

  async readNotification(userId: number, dto: NotificationsReadDto) {
    return this.send<SuccessDto, NotificationsReadDto>(
      NotificationMicroserviceMessagePattern.READ_NOTIFICATIONS,
      userId,
      dto,
    );
  }
  async sendNotification(userId: number, dto: NotificationsSendDto) {
    this.notificationService.emit<SuccessDto>(
      NotificationMicroserviceMessagePattern.SEND_NOTIFICATION,
      { userId, ...dto },
    );
  }

  private async send<R, P>(
    messagePattern: NotificationMicroserviceMessagePattern,
    userId: number,
    payload: P,
  ) {
    const response = this.notificationService.send<R>(messagePattern, { userId, ...payload });
    const data = await lastValueFrom(response);
    return data;
  }
}
