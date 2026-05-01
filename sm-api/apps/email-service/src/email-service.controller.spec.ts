import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, RabbitMqModule } from '@san-martin/san-martin-libs';

import { EmailServiceController } from './email-service.controller';
import { EmailServiceService } from './email-service.service';

describe('EmailServiceController', () => {
  let emailServiceController: EmailServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, RabbitMqModule],
      controllers: [EmailServiceController],
      providers: [EmailServiceService],
    }).compile();

    emailServiceController = app.get<EmailServiceController>(EmailServiceController);
  });

  describe('email tests', () => {
    it('should return "messageId"', async () => {
      const sendEmailBody = {
        subject: 'Unit test',
        textContent: 'Test',
        to: [{ name: 'Unit Test', email: 'example@exampe.com' }],
        sandbox: true,
      };

      const response = await emailServiceController.sendEmail(sendEmailBody);

      expect(response).toHaveProperty('messageId');
    });

    it('should return error subject', async () => {
      const sendEmailBody = {
        subject: undefined,
        textContent: 'Test',
        to: [{ name: 'Unit Test', email: 'example@exampe.com' }],
        sandbox: true,
      };

      const response = await emailServiceController.sendEmail(sendEmailBody);

      expect(response).toEqual({
        code: 'missing_parameter',
        message: 'subject is required',
      });
    });

    it('should return error textContent', async () => {
      const sendEmailBody = {
        subject: 'Unit test',
        textContent: undefined,
        to: [{ name: 'Unit Test', email: 'example@exampe.com' }],
        sandbox: true,
      };

      const response = await emailServiceController.sendEmail(sendEmailBody);

      expect(response).toEqual({
        code: 'missing_parameter',
        message: 'Either of htmlContent or textContent is required',
      });
    });

    it('should return error to', async () => {
      const sendEmailBody = {
        subject: 'Unit test',
        textContent: 'Test',
        to: [],
        sandbox: true,
      };

      const response = await emailServiceController.sendEmail(sendEmailBody);

      expect(response).toEqual({
        code: 'missing_parameter',
        message: 'to is missing',
      });
    });
  });
});
