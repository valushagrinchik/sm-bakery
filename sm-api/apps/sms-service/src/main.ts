import { NestFactory } from '@nestjs/core';
import { MicroserviceChanelName, RabbitMqService } from '@san-martin/san-martin-libs';

import { SmsServiceModule } from './sms-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SmsServiceModule);
  const rmqService = app.get<RabbitMqService>(RabbitMqService);
  app.connectMicroservice(rmqService.getOptions(MicroserviceChanelName.SMS_SERVICE));
  await app.startAllMicroservices();
}
bootstrap();
