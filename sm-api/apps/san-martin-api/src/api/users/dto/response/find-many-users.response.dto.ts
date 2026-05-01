import { ApiProperty } from '@nestjs/swagger';
import { FindManyResponseDto } from '@san-martin/san-martin-libs';

import { UserResponseDto } from './user.response.dto';

export class FindManyUsersResponseDto extends FindManyResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  result: UserResponseDto[];
}
