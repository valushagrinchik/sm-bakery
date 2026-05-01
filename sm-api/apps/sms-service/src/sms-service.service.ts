import { Injectable } from '@nestjs/common';
import { AppConfigService, SendSmsDto } from '@san-martin/san-martin-libs';

const brevo = require('@getbrevo/brevo');

@Injectable()
export class SmsServiceService {
  private apiInstance = new brevo.TransactionalSMSApi();

  constructor(private readonly appConfigService: AppConfigService) {
    const apiKey = this.apiInstance.authentications['apiKey'];
    apiKey.apiKey = this.appConfigService.emailService.brevoApiKey;
  }

  sendSms({ phoneNumber, content }: SendSmsDto) {
    let sendTransacSms = new brevo.SendTransacSms();
    sendTransacSms.type = 'transactional';
    sendTransacSms.unicodeEnabled = true;
    sendTransacSms.sender = 'SanMartin';
    sendTransacSms.recipient = phoneNumber;
    sendTransacSms.content = content;
    sendTransacSms.organisationPrefix = 'San Martin';

    this.apiInstance.sendTransacSms(sendTransacSms).then(
      (data) => {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
