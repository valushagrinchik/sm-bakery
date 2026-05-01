export class ToSendDto {
  email: string;
  name: string;
}

export class SendEmailDto {
  subject: string;
  textContent?: string;
  htmlContent?: string;
  to: ToSendDto[];
  sandbox?: boolean;
}
