import { ApiProperty } from '@nestjs/swagger';
import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @Validate(TypeValidate.EMAIL, {
    required: true,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    required: true,
    type: String,
    example: '123456',
  })
  emailVerificationCode: string;
}
