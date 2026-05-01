import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendEmailDto } from '@san-martin/san-martin-libs';

import { EmailServiceService } from './email-service.service';

@Controller()
export class EmailServiceController {
  constructor(private readonly emailServiceService: EmailServiceService) {}

  @MessagePattern('send-email')
  async sendEmail(@Payload() body: SendEmailDto): Promise<{
    messageId: string;
  }> {
    return this.emailServiceService.sendEmail(body);
  }
}
