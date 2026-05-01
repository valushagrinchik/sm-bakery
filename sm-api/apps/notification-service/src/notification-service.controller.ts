import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  SuccessDto,
  NotificationMicroserviceMessagePattern,
  NotificationsReadDto,
  NotificationsSendDto,
  SetAppTokenDto,
  FindManyNotificationsDto,
} from '@san-martin/san-martin-libs';

import { AuthDto } from './dto/auth.dto';
import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationServiceService: NotificationServiceService) {}

  @MessagePattern(NotificationMicroserviceMessagePattern.SET_APP_TOKEN)
  async setAppToken(dto: SetAppTokenDto & AuthDto) {
    await this.notificationServiceService.setAppToken(dto);
    return new SuccessDto({ message: 'success' });
  }

  @MessagePattern(NotificationMicroserviceMessagePattern.READ_NOTIFICATIONS)
  async read(dto: NotificationsReadDto & AuthDto) {
    await this.notificationServiceService.read(dto);
    return new SuccessDto({ message: 'success' });
  }

  @MessagePattern(NotificationMicroserviceMessagePattern.GET_NOTIFICATIONS)
  async notifications(dto: FindManyNotificationsDto & AuthDto) {
    return await this.notificationServiceService.notifications(dto);
  }

  @MessagePattern(NotificationMicroserviceMessagePattern.SEND_NOTIFICATION)
  async send(dto: NotificationsSendDto & AuthDto) {
    const message = await this.notificationServiceService.send(dto);
    return new SuccessDto({ message });
  }
}
