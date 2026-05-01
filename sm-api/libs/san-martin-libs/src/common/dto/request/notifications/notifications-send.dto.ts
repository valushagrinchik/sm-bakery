import { TypeValidate, Validate } from './../../../decorators';

export class NotificationsSendDto {
  @Validate(TypeValidate.STRING)
  title: string;

  @Validate(TypeValidate.STRING)
  body: string;
}
