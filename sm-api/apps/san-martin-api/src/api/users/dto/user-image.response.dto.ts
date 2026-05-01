import { ApiProperty } from '@nestjs/swagger';

export class UserImageResponseDto {
  @ApiProperty()
  url: string;
}
