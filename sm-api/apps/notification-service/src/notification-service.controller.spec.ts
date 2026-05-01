import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, RabbitMqModule, entityProviders } from '@san-martin/san-martin-libs';

import { DestroyStaleTokensTaskService } from './destroy-stale-tokens-task.service';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let notificationServiceController: NotificationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, RabbitMqModule],
      controllers: [NotificationServiceController],
      providers: [
        { provide: 'FIREBASE_CLOUD_MESSAGING', useValue: { messaging: jest.fn() } },
        NotificationServiceService,
        DestroyStaleTokensTaskService,
        ...entityProviders.notificationsProvider,
        ...entityProviders.notificationsUsersTokensProvider,
      ],
    }).compile();

    notificationServiceController = app.get<NotificationServiceController>(
      NotificationServiceController,
    );
  });

  it('should be defined', () => {
    expect(notificationServiceController).toBeDefined();
  });
});
