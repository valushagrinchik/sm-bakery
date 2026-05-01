import { ApiProperty } from '@nestjs/swagger';
import { DeliverySubZonesTimeWorkEntity, TimeWorkResponseDto } from '@san-martin/san-martin-libs';

export class DeliverySubZoneTimeWorkResponseDto extends TimeWorkResponseDto {
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty({ required: false })
  deliverySubZoneId: number;

  constructor(data: DeliverySubZonesTimeWorkEntity) {
    super(data.dataValues as unknown as Record<string, unknown>);
    Object.assign(this, data.dataValues);
  }
}
