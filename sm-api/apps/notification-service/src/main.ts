import { NestFactory } from '@nestjs/core';
import { MicroserviceChanelName, RabbitMqService } from '@san-martin/san-martin-libs';

import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const rmqService = app.get<RabbitMqService>(RabbitMqService);
  app.connectMicroservice(rmqService.getOptions(MicroserviceChanelName.NOTIFICATION_SERVICE));
  await app.startAllMicroservices();
}
bootstrap();
