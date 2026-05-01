import { ApiProperty } from '@nestjs/swagger';
import { StoresTimeWorkEntity, TimeWorkResponseDto } from '@san-martin/san-martin-libs';

export class StoresTimeWorkResponseDto extends TimeWorkResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  storeId?: number;

  constructor(data: StoresTimeWorkEntity) {
    super(data.dataValues as unknown as Record<string, unknown>);
    Object.assign(this, data.dataValues);
  }
}
