import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceChanelName, RabbitMqModule } from '@san-martin/san-martin-libs';

import { UsersNotificationsController } from './users-notifications.controller';
import { UsersNotificationsService } from './users-notifications.service';

describe('UsersNotificationsController', () => {
  let controller: UsersNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersNotificationsController],
      imports: [RabbitMqModule.register({ name: MicroserviceChanelName.NOTIFICATION_SERVICE })],
      providers: [UsersNotificationsService],
    }).compile();

    controller = module.get<UsersNotificationsController>(UsersNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
