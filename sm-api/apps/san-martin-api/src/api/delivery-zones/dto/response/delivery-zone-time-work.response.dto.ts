import { ApiProperty } from '@nestjs/swagger';
import { DeliveryZonesTimeWorkEntity, TimeWorkResponseDto } from '@san-martin/san-martin-libs';

export class DeliveryZoneTimeWorkResponseDto extends TimeWorkResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  deliveryZoneId: number;

  constructor(data: DeliveryZonesTimeWorkEntity) {
    super(data.dataValues as unknown as Record<string, unknown>);
    Object.assign(this, data.dataValues);
  }
}
