import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EntityProviders,
  FindManyNotificationsDto,
  NotificationsReadDto,
  NotificationsSendDto,
  SetAppTokenDto,
} from '@san-martin/san-martin-libs';
import { NotificationsUsersTokensEntity } from '@san-martin/san-martin-libs/database/entities/notifications/notifications-users-tokens.entity';
import { NotificationsEntity } from '@san-martin/san-martin-libs/database/entities/notifications/notifications.entity';
import dayjs from 'dayjs';
import * as admin from 'firebase-admin';
import { FirebaseMessagingError } from 'firebase-admin/messaging';
import { Op } from 'sequelize';

import { AuthDto } from './dto/auth.dto';

@Injectable()
export class NotificationServiceService {
  private readonly logger = new Logger(NotificationServiceService.name);

  constructor(
    @Inject('FIREBASE_CLOUD_MESSAGING') private firebaseMessaging: admin.messaging.Messaging,
    @Inject(EntityProviders.NOTIFICATIONS_PROVIDER)
    private notificationsProvider: typeof NotificationsEntity,

    @Inject(EntityProviders.NOTIFICATIONS_USERS_TOKENS_PROVIDER)
    private notificationsUsersTokensProvider: typeof NotificationsUsersTokensEntity,
  ) {}

  async send({ userId, title, body }: NotificationsSendDto & AuthDto) {
    const res = await this.notificationsUsersTokensProvider.findOne({
      where: { userId },
    });

    if (!res?.token) {
      return 'USER_IS_INACTIVE';
    }

    let fcmId = '';
    try {
      fcmId = await this.firebaseMessaging.send({
        token: res.token,
        notification: { title, body },
      });
    } catch (error: any) {
      if (
        (error instanceof FirebaseMessagingError &&
          error.code == 'messaging/registration-token-not-registered') ||
        (error.code == 'messaging/invalid-argument' &&
          error.message == 'The registration token is not a valid FCM registration token')
      ) {
        await this.destroyToken(userId);
        return 'USER_IS_INACTIVE';
      }
      this.logger.error(`Send notification for user ${userId} error: `, error.message);
      return 'FAILED';
    }

    await this.notificationsProvider.create({
      userId,
      title,
      body,
      fcmId,
    });

    return 'SUCCESS';
  }

  async setAppToken(dto: SetAppTokenDto & AuthDto) {
    await this.notificationsUsersTokensProvider.upsert({ ...dto, deletedAt: null });
  }

  async notifications({ userId, offset, limit, isRead }: FindManyNotificationsDto & AuthDto) {
    return await this.notificationsProvider.findAndCountAll({
      where: { userId, ...(isRead != undefined || isRead != null ? { isRead } : {}) },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async read({ userId, id, all }: NotificationsReadDto & AuthDto) {
    if (id) {
      await this.notificationsProvider.update({ isRead: true }, { where: { userId, id } });
    }

    if (all) {
      await this.notificationsProvider.update(
        { isRead: true },
        { where: { userId, isRead: false } },
      );
    }
  }

  async destroyToken(userId: number) {
    await this.notificationsUsersTokensProvider.destroy({ where: { userId } });
  }

  async destroyStaleTokens() {
    await this.notificationsUsersTokensProvider.destroy({
      where: { updatedAt: { [Op.lte]: dayjs().add(-30, 'days') } },
    });
  }
}
