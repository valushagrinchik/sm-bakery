import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, EntityProviders, RabbitMqModule } from '@san-martin/san-martin-libs';
import { FirebaseMessagingError } from 'firebase-admin/messaging';

import { DestroyStaleTokensTaskService } from './destroy-stale-tokens-task.service';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

jest.mock('dayjs', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
    })),
    extend: jest.fn(),
  };
});

const notificationsProvider = { findAndCountAll: jest.fn(), update: jest.fn(), create: jest.fn() };
const notificationsUsersTokensProvider = {
  findOne: jest.fn(),
  upsert: jest.fn(),
  destroy: jest.fn(),
};

describe('NotificationServiceService', () => {
  let service: NotificationServiceService;

  let firebaseMessagingProvider;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, RabbitMqModule],
      controllers: [NotificationServiceController],
      providers: [
        {
          provide: 'FIREBASE_CLOUD_MESSAGING',
          useValue: { send: jest.fn() },
        },
        NotificationServiceService,
        DestroyStaleTokensTaskService,
        { provide: EntityProviders.NOTIFICATIONS_PROVIDER, useValue: notificationsProvider },
        {
          provide: EntityProviders.NOTIFICATIONS_USERS_TOKENS_PROVIDER,
          useValue: notificationsUsersTokensProvider,
        },
      ],
    }).compile();

    firebaseMessagingProvider = app.get('FIREBASE_CLOUD_MESSAGING');
    service = app.get(NotificationServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.setAppToken', () => {
    it('should upsert token', async () => {
      notificationsUsersTokensProvider.upsert.mockResolvedValue(null);
      const res = await service.setAppToken({ userId: 1, token: 'test' });
      expect(res).toBe(undefined);
    });
  });

  describe('.notifications', () => {
    it('should return paginated list of notifications', async () => {
      const paginatedResponse = { rows: [], count: 0 };
      notificationsProvider.findAndCountAll.mockResolvedValue(paginatedResponse);
      const res = await service.notifications({ userId: 1, offset: 0, limit: 10 });
      expect(res).toBe(paginatedResponse);
    });
  });

  describe('.read', () => {
    it('mark notification as read', async () => {
      notificationsProvider.update.mockResolvedValue(null);
      const res = await service.read({ userId: 1, id: 1 });
      expect(res).toBe(undefined);
    });
  });

  describe('.send', () => {
    it("returns error code if user doesn't exist", async () => {
      notificationsUsersTokensProvider.findOne.mockResolvedValue(null);
      const res = await service.send({ userId: 1, title: 'The best title!', body: 'Body!' });
      expect(res).toBe('USER_IS_INACTIVE');
    });
    it('returns error code if token is invalid', async () => {
      notificationsUsersTokensProvider.findOne.mockResolvedValue({ token: 'test' });
      firebaseMessagingProvider.send.mockImplementation(() => {
        // @ts-ignore
        throw new FirebaseMessagingError({
          code: 'invalid-argument',
          message: 'The registration token is not a valid FCM registration token',
        });
      });

      const res = await service.send({ userId: 1, title: 'The best title!', body: 'Body!' });
      expect(res).toBe('USER_IS_INACTIVE');
    });
    it('returns error code if token is no longer valid', async () => {
      notificationsUsersTokensProvider.findOne.mockResolvedValue({ token: 'test' });
      firebaseMessagingProvider.send.mockImplementation(() => {
        // @ts-ignore
        throw new FirebaseMessagingError({
          code: 'registration-token-not-registered',
        });
      });

      const res = await service.send({ userId: 1, title: 'The best title!', body: 'Body!' });
      expect(res).toBe('USER_IS_INACTIVE');
    });

    it('returns error code if any other fsm error', async () => {
      notificationsUsersTokensProvider.findOne.mockResolvedValue({ token: 'test' });
      firebaseMessagingProvider.send.mockImplementation(() => {
        // @ts-ignore
        throw new FirebaseMessagingError({
          code: 'other',
        });
      });

      const res = await service.send({ userId: 1, title: 'The best title!', body: 'Body!' });
      expect(res).toBe('FAILED');
    });

    it('send notification to user', async () => {
      const notification = {
        userId: 1,
        read: false,
        fcmId: 'fcmId',
        title: 'The best title!',
        body: 'Body!',
      };
      const sendMock = jest.fn().mockResolvedValue(notification.fcmId);
      firebaseMessagingProvider.send.mockResolvedValue(sendMock);
      notificationsUsersTokensProvider.findOne.mockResolvedValue({
        token: 'test',
      });
      notificationsProvider.create.mockResolvedValue(notification);
      const res = await service.send({
        userId: notification.userId,
        title: notification.title,
        body: notification.body,
      });
      expect(res).toBe('SUCCESS');
    });
  });

  describe('.destroyStaleTokens', () => {
    it('destroy user with stale token', async () => {
      notificationsUsersTokensProvider.destroy.mockResolvedValue(null);
      const res = await service.destroyStaleTokens();
      expect(res).toBe(undefined);
    });
  });
});
