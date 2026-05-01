import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppConfigService, AwsModule, AwsService } from '@san-martin/san-martin-libs';

import { BullQueueService } from './bull-queue.service';
import { BullQueueProcessor } from '../bull-queue/bull-queue.processor';
import { BullProcessorsName } from '../common/enums/bull-processor-names';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        redis: {
          host: appConfigService.redis.host,
          port: appConfigService.redis.port,
          password: appConfigService.redis.password,
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: BullProcessorsName.BULL_QUEUE,
    }),
    AwsModule,
  ],
  providers: [BullQueueProcessor, BullQueueService, AwsService],
  exports: [
    BullQueueProcessor,
    BullQueueService,
    BullModule.registerQueueAsync({
      name: BullProcessorsName.BULL_QUEUE,
    }),
  ],
})
export class BullQueueModule {}
