import { TypeValidate, Validate } from './../../../decorators';

export class NotificationsReadDto {
  @Validate(TypeValidate.NUMBER, { required: false })
  id?: number;

  @Validate(TypeValidate.BOOLEAN, { required: false })
  all?: boolean;
}
