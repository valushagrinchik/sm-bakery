import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService, BullProcessorsName } from '@san-martin/san-martin-libs';

import { BullQueueService } from './bull-queue.service';

describe('BullQueueService', () => {
  let service: BullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.forRootAsync({
          imports: [AppConfigModule],
          inject: [AppConfigService],
          useFactory: async (appConfigService: AppConfigService) => ({
            redis: {
              host: appConfigService.redis.host,
              port: appConfigService.redis.port,
            },
          }),
        }),
        BullModule.registerQueueAsync({
          name: BullProcessorsName.BULL_QUEUE,
        }),
      ],
      providers: [BullQueueService],
    }).compile();

    service = module.get<BullQueueService>(BullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
