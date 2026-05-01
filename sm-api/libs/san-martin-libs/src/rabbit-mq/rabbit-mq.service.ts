import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { AppConfigService } from '@san-martin/san-martin-libs';

@Injectable()
export class RabbitMqService {
  constructor(private readonly appConfigService: AppConfigService) {}

  getOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.appConfigService.rabbitMQHost],
        queue: `${this.appConfigService.getServerType}-${queue}`,
        queueOptions: {
          durable: false,
        },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
