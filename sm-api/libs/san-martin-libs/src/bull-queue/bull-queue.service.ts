import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { BullProcessorsName } from '../common/enums/bull-processor-names';

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(BullProcessorsName.BULL_QUEUE)
    private readonly bullQueue: Queue,
  ) {}

  async createBullQueue(
    processName: string,
    data: any,
    delay: number,
    attempts: number,
    delayForStatusFail: number,
  ) {
    await this.bullQueue.add(processName, data, {
      delay: delay,
      removeOnComplete: true,
      removeOnFail: true,
      attempts: attempts,
      backoff: { type: 'fixed', delay: delayForStatusFail },
    });
  }
}
