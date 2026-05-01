import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { AwsService } from '@san-martin/san-martin-libs';
import { iDeleteImage } from '@san-martin/san-martin-libs/bull-queue/interface/delete-image.interface';

import { BullProcessorNames, BullProcessorsName } from '../common/';

@Injectable()
@Processor(BullProcessorsName.BULL_QUEUE)
export class BullQueueProcessor {
  constructor(private readonly awsService: AwsService) {}

  @Process(BullProcessorNames.DELETE_IMAGE)
  async deleteImage({ data }: iDeleteImage) {
    try {
      await this.awsService.deleteImage(data.key);
    } catch (e) {
      console.log(e);
    }
  }
}
