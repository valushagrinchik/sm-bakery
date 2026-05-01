import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { NotificationServiceService } from './notification-service.service';

@Injectable()
export class DestroyStaleTokensTaskService {
  constructor(private notificationServiceService: NotificationServiceService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async destroyStaleTokens() {
    await this.notificationServiceService.destroyStaleTokens();
  }
}
