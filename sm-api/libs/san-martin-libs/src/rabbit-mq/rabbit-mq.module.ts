import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';

import { RabbitMqService } from './rabbit-mq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  imports: [AppConfigModule],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            imports: [AppConfigModule],
            useFactory: (appConfigService: AppConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [appConfigService.rabbitMQHost],
                queue: `${appConfigService.getServerType}-${name}`,
                queueOptions: {
                  durable: false,
                },
              },
            }),
            inject: [AppConfigService],
          },
        ]),
        AppConfigModule,
      ],
      exports: [ClientsModule],
    };
  }
}
