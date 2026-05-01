import { ApiProperty } from '@nestjs/swagger';
import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetPasswordCodeDto {
  @Validate(TypeValidate.EMAIL, {
    required: true,
    type: String,
    example: 'george.lucas@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, example: '<reset_password_code>' })
  resetPasswordCode: string;
}
