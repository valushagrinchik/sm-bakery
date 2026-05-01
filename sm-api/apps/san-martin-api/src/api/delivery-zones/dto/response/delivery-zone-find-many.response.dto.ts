import { ApiProperty } from '@nestjs/swagger';
import { FindManyResponseDto } from '@san-martin/san-martin-libs';

import { DeliveryZoneResponseDto } from './delivery-zone.response.dto';

export class DeliveryZoneFindManyResponseDto extends FindManyResponseDto {
  @ApiProperty({ type: () => [DeliveryZoneResponseDto] })
  result: DeliveryZoneResponseDto[];
}
