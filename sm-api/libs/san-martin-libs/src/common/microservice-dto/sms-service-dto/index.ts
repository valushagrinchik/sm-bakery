import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendSmsDto {
  @ApiProperty()
  @IsString()
  phoneNumber: string;
  @ApiProperty()
  @IsString()
  content: string;
}
