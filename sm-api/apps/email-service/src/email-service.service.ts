import { Injectable } from '@nestjs/common';
import { AppConfigService, SendEmailDto } from '@san-martin/san-martin-libs';

const brevo = require('@getbrevo/brevo');

@Injectable()
export class EmailServiceService {
  private apiInstance = new brevo.TransactionalEmailsApi();

  constructor(private readonly appConfigService: AppConfigService) {
    const apiKey = this.apiInstance.authentications['apiKey'];
    apiKey.apiKey = this.appConfigService.emailService.brevoApiKey;
  }

  async sendEmail({ subject, textContent, htmlContent, to, sandbox }: SendEmailDto): Promise<{
    messageId: string;
  }> {
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }
    if (htmlContent) {
      sendSmtpEmail.htmlContent = htmlContent;
    }
    sendSmtpEmail.sender = {
      name: 'San Martin',
      email: this.appConfigService.emailService.senderEmail,
    };
    sendSmtpEmail.to = to;

    if (sandbox) {
      sendSmtpEmail.headers = { 'X-Sib-Sandbox': 'drop ' };
    }

    return this.apiInstance.sendTransacEmail(sendSmtpEmail).then(
      (data) => {
        return data.body;
      },
      (error) => {
        if (error.body) {
          return error.body;
        }
      },
    );
  }
}
