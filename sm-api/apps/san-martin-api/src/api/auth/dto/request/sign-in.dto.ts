import { ApiProperty } from '@nestjs/swagger';
import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @Validate(TypeValidate.EMAIL, {
    required: true,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=\- ]+$/)
  @ApiProperty({
    required: true,
    type: String,
    example: '123456Aa!',
    description: `
    - Minimum 8 characters;
    - Maximum 20 characters;
  `,
  })
  password: string;
}
