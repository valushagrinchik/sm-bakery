import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AppConfigService,
  AwsService,
  BullQueueService,
  entityProviders,
  MicroserviceChanelName,
  RabbitMqModule,
  RedisModule,
  RedisService,
} from '@san-martin/san-martin-libs';
import { BullProcessorsName } from '@san-martin/san-martin-libs/common/enums/bull-processor-names';

import { UsersMeController } from './users-me.controller';
import { UsersAdminController } from './users.admin.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    RedisModule,
    RabbitMqModule.register({ name: MicroserviceChanelName.EMAIL_SERVICE }),
    RabbitMqModule.register({ name: MicroserviceChanelName.SMS_SERVICE }),
    RolesModule,
    BullModule.registerQueueAsync({
      name: BullProcessorsName.BULL_QUEUE,
    }),
  ],
  providers: [
    JwtService,
    UsersService,
    RedisService,
    AppConfigService,
    AwsService,
    BullQueueService,
    ...entityProviders.userProviders,
    ...entityProviders.customersProvider,
    ...entityProviders.operatorsProvider,
    ...entityProviders.usersAddressProvider,
    ...entityProviders.storeDeliveryZonesProvider,
    ...entityProviders.versionsProvider,
  ],
  controllers: [UsersMeController, UsersController, UsersAdminController],
  exports: [UsersService],
})
export class UsersModule {}
