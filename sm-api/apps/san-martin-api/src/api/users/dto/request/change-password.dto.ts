import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @Validate(TypeValidate.STRING, {
    type: String,
    example: '123456Aa!',
  })
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=\- ]+$/)
  oldPassword: string;

  @Validate(TypeValidate.STRING, {
    type: String,
    example: '123456Aa!',
  })
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=\- ]+$/)
  password: string;
}
