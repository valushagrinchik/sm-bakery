import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, RabbitMqModule } from '@san-martin/san-martin-libs';

import { SmsServiceController } from './sms-service.controller';
import { SmsServiceService } from './sms-service.service';

describe('SmsServiceController', () => {
  let smsServiceController: SmsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, RabbitMqModule],
      controllers: [SmsServiceController],
      providers: [SmsServiceService],
    }).compile();

    smsServiceController = app.get<SmsServiceController>(SmsServiceController);
  });

  it('should be defined', () => {
    expect(smsServiceController).toBeDefined();
  });
});
