import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @Validate(TypeValidate.EMAIL, {
    required: true,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Validate(TypeValidate.STRING, { required: true, type: String, example: '<reset_password_code>' })
  @IsNotEmpty()
  resetPasswordCode: string;

  @Validate(TypeValidate.STRING, {
    required: true,
    type: String,
    example: '123456Aa!',
    description: `
    - Minimum 8 characters;
    - At least one uppercase and lowercase letter; 
    - One number and special character (@$!%*?&);
  `,
  })
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=\- ]+$/)
  newPassword: string;
}
