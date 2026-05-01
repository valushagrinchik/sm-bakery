import { Module } from '@nestjs/common';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';

import { AwsService } from './aws.service';

@Module({
  imports: [AppConfigModule],
  providers: [AwsService, AppConfigService],
  exports: [AwsService],
})
export class AwsModule {}
