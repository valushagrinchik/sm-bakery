import { Module } from '@nestjs/common';
import {
  AppConfigModule,
  AppConfigService,
  DatabaseModule,
  entityProviders,
  RabbitMqModule,
} from '@san-martin/san-martin-libs';
import * as admin from 'firebase-admin';

import { DestroyStaleTokensTaskService } from './destroy-stale-tokens-task.service';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

const firebaseProvider = {
  provide: 'FIREBASE_CLOUD_MESSAGING',
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService) => {
    return admin
      .initializeApp({
        credential: admin.credential.cert(configService.firebase),
      })
      .messaging();
  },
};

@Module({
  imports: [AppConfigModule, DatabaseModule, RabbitMqModule],
  controllers: [NotificationServiceController],
  providers: [
    firebaseProvider,
    NotificationServiceService,
    DestroyStaleTokensTaskService,
    ...entityProviders.notificationsProvider,
    ...entityProviders.notificationsUsersTokensProvider,
  ],
})
export class NotificationServiceModule {}
