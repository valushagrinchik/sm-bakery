import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendSmsDto } from '@san-martin/san-martin-libs';

import { SmsServiceService } from './sms-service.service';

@Controller()
export class SmsServiceController {
  constructor(private readonly smsServiceService: SmsServiceService) {}

  @MessagePattern('send-sms')
  sendSms(@Payload() body: SendSmsDto) {
    this.smsServiceService.sendSms(body);
  }
}
