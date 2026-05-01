import { TypeValidate, Validate } from './../../../decorators';

export class SetAppTokenDto {
  @Validate(TypeValidate.STRING)
  token: string;
}
