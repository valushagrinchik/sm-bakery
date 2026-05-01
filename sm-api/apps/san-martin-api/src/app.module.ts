import { Global, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
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
  imports: [
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL) || 60000,
      limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    }]),
    AppConfigModule,
    DatabaseModule,
    ApiModule,
    RedisModule,
    AwsModule,
    BullQueueModule,
  ],
  exports: [AppConfigModule, ApiModule],
})
export class AppModule {}
