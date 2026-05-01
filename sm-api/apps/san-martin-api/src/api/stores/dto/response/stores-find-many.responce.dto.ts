import { ApiProperty } from '@nestjs/swagger';
import { FindManyResponseDto } from '@san-martin/san-martin-libs';

import { StoresResponseDto } from './stores.response.dto';

export class StoresFindManyResponseDto extends FindManyResponseDto {
  @ApiProperty({ type: [StoresResponseDto] })
  result: StoresResponseDto[];
}
