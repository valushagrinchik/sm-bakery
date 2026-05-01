import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { IsOptional, Matches, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @Validate(TypeValidate.STRING, {
    required: false,
    type: String,
    example: 'George',
  })
  firstName: string;

  @Validate(TypeValidate.STRING, {
    required: false,
    type: String,
    example: 'Lucas',
  })
  lastName: string;

  @Validate(TypeValidate.EMAIL, {
    required: true,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Validate(TypeValidate.STRING, {
    required: true,
    type: String,
    example: '123456Aa!',
    description: `
    - Minimum 8 characters;
    - Maximum 20 characters;
  `,
  })
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=\- ]+$/)
  password: string;

  @Validate(TypeValidate.STRING, {
    required: false,
    type: String,
    example: '+50221231234',
  })
  @IsOptional()
  phone?: string;

  @Validate(TypeValidate.STRING, {
    required: false,
    type: String,
    example: '1996-01-01',
  })
  @IsOptional()
  birthday?: Date;

  @Validate(TypeValidate.NUMBER, {
    required: true,
    type: Number,
  })
  countryId: number;
}
