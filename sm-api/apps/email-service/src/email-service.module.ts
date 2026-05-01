import { Module } from '@nestjs/common';
import { AppConfigModule, RabbitMqModule } from '@san-martin/san-martin-libs';

import { EmailServiceController } from './email-service.controller';
import { EmailServiceService } from './email-service.service';

@Module({
  imports: [AppConfigModule, RabbitMqModule],
  controllers: [EmailServiceController],
  providers: [EmailServiceService],
})
export class EmailServiceModule {}
