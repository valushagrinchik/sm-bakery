import { Test, TestingModule } from '@nestjs/testing';

import { RabbitMqModule } from './rabbit-mq.module';
import { RabbitMqService } from './rabbit-mq.service';

describe('RabbitMqService', () => {
  let service: RabbitMqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RabbitMqModule],
    }).compile();

    service = module.get<RabbitMqService>(RabbitMqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
