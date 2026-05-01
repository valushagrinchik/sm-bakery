import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendSmsCodeDto {
  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  userId: number;
}

export class VerifySmsCodeDto {
  @ApiProperty({ description: 'SMS verification code' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  code: string;
}

export class UserPhoneDto {
  @ApiProperty({ description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class ChangePhoneDto {
  @ApiProperty({ description: 'New phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'SMS verification code' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  code: string;
}

export class ChangeEmailDto {
  @ApiProperty({ description: 'New email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Email verification code' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset password token' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ description: 'New password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
