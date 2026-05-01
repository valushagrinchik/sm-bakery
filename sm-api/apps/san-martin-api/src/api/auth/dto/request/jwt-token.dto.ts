import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class JwtTokenDto {
  @IsJWT()
  @ApiProperty({
    required: true,
    type: String,
    example: '<access_token>',
  })
  accessToken: string;

  @IsJWT()
  @ApiProperty({
    required: true,
    type: String,
    example: '<refresh_token>',
  })
  refreshToken: string;
}
