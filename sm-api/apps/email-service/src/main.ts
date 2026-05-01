import { NestFactory } from '@nestjs/core';
import { MicroserviceChanelName, RabbitMqService } from '@san-martin/san-martin-libs';

import { EmailServiceModule } from './email-service.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailServiceModule);
  const rmqService = app.get<RabbitMqService>(RabbitMqService);
  app.connectMicroservice(rmqService.getOptions(MicroserviceChanelName.EMAIL_SERVICE));
  await app.startAllMicroservices();
}
bootstrap();
