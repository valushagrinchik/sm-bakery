import { ApiProperty } from '@nestjs/swagger';
import { UserAddressType, UsersAddressEntity } from '@san-martin/san-martin-libs';

export class UsersAddressResponseDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  userId?: number;

  @ApiProperty({ enum: UserAddressType })
  type?: UserAddressType;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  state?: string;

  @ApiProperty()
  subLocality?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  positionLat?: number;

  @ApiProperty()
  positionLng?: number;

  @ApiProperty()
  addressDetails?: string;

  @ApiProperty()
  floorNumber?: number;

  @ApiProperty()
  doorNumber?: string;

  @ApiProperty()
  isDefault?: boolean;

  @ApiProperty()
  isAvailable?: boolean;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  deletedAt?: Date;

  constructor(data: UsersAddressEntity) {
    Object.assign(this, data.dataValues);

    if (data.dataValues['isAvailable']) {
      this.isAvailable = data.dataValues['isAvailable'];
    }
  }
}
