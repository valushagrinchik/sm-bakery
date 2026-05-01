import { ApiProperty } from '@nestjs/swagger';
import { CustomersEntity, ProviderType } from '@san-martin/san-martin-libs';

export class CustomerResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  userId?: number;

  @ApiProperty({ required: false })
  birthday?: Date;

  @ApiProperty({ required: false, enum: ProviderType })
  authProvider?: ProviderType;

  @ApiProperty({ required: false })
  sub?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  constructor(data: CustomersEntity) {
    Object.assign(this, data.dataValues);
  }
}
