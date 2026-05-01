import { TypeValidate, Validate } from '../decorators/validation';

export class SuccessDto {
  @Validate(TypeValidate.STRING)
  message: string;

  constructor(data: Partial<SuccessDto>) {
    Object.assign(this, data);
  }
}
