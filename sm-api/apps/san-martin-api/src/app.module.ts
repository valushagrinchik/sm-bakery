import { Global, Module } from '@nestjs/common';
import {
  AppConfigModule,
  AwsModule,
  BullQueueModule,
  DatabaseModule,
  RedisModule,
} from '@san-martin/san-martin-libs';

import { ApiModule } from './api/api.module';

@Global()
@Module({
  imports: [AppConfigModule, DatabaseModule, ApiModule, RedisModule, AwsModule, BullQueueModule],
  exports: [AppConfigModule, ApiModule],
})
export class AppModule {}
