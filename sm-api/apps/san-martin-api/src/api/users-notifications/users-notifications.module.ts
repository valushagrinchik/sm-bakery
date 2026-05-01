import { Module } from '@nestjs/common';
import { RabbitMqModule, MicroserviceChanelName } from '@san-martin/san-martin-libs';

import { UsersNotificationsController } from './users-notifications.controller';
import { UsersNotificationsService } from './users-notifications.service';

@Module({
  imports: [RabbitMqModule.register({ name: MicroserviceChanelName.NOTIFICATION_SERVICE })],
  controllers: [UsersNotificationsController],
  providers: [UsersNotificationsService],
  exports: [UsersNotificationsService],
})
export class UsersNotificationsModule {}
