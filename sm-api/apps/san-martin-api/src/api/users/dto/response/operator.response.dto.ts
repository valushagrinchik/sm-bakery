import { ApiProperty } from '@nestjs/swagger';
import { OperatorsEntity } from '@san-martin/san-martin-libs';

export class OperatorResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  userId?: number;

  @ApiProperty({ required: false })
  countryId?: number;

  @ApiProperty({ required: false })
  storeId?: number;

  @ApiProperty({ required: false })
  deliveryZoneId?: number;

  @ApiProperty({ required: false })
  webKey?: string;

  @ApiProperty({ required: false })
  appKey?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  constructor(data: OperatorsEntity) {
    Object.assign(this, data.dataValues);
  }
}
