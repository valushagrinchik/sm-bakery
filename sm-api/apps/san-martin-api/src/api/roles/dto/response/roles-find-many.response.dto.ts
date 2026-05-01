import { ApiProperty } from '@nestjs/swagger';
import { FindManyResponseDto } from '@san-martin/san-martin-libs';

import { RoleResponseDto } from './role.response.dto';

export class RolesFindManyResponseDto extends FindManyResponseDto {
  @ApiProperty({ type: [RoleResponseDto] })
  result: RoleResponseDto[];
}
