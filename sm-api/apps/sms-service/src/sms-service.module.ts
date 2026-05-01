import { Module } from '@nestjs/common';
import { AppConfigModule, RabbitMqModule } from '@san-martin/san-martin-libs';

import { SmsServiceController } from './sms-service.controller';
import { SmsServiceService } from './sms-service.service';

@Module({
  imports: [AppConfigModule, RabbitMqModule],
  controllers: [SmsServiceController],
  providers: [SmsServiceService],
})
export class SmsServiceModule {}
