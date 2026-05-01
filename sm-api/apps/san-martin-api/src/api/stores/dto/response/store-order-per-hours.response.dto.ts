import { ApiProperty } from '@nestjs/swagger';
import {
  iListOrderPerHours,
  StoreOrderPerHoursEntity,
  WeekName,
} from '@san-martin/san-martin-libs';

import { ListOrderPerHoursDto } from '../request/store-order-per-hours.dto';

export class StoreOrderPerHoursResponseDto {
  @ApiProperty({ required: false, type: Number })
  storeId?: number;

  @ApiProperty({ required: false, enum: WeekName, enumName: 'WeekName' })
  weekName: WeekName;

  @ApiProperty({ required: false, type: [ListOrderPerHoursDto] })
  listOrderPerHours: iListOrderPerHours[];

  constructor(data: StoreOrderPerHoursEntity) {
    Object.assign(this, data.dataValues);
  }
}
