import { ApiProperty } from '@nestjs/swagger';
import { PermissionsEntity } from '@san-martin/san-martin-libs';

export class PermissionResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  roleId?: number;

  @ApiProperty({ required: false })
  createUser?: boolean;

  @ApiProperty({ required: false })
  updateUser?: boolean;

  @ApiProperty({ required: false })
  viewUser?: boolean;
  @ApiProperty({ required: false })
  deleteUser?: boolean;

  @ApiProperty({ required: false })
  createCountry?: boolean;

  @ApiProperty({ required: false })
  updateCountry?: boolean;

  @ApiProperty({ required: false })
  viewCountry?: boolean;

  @ApiProperty({ required: false })
  deleteCountry?: boolean;

  @ApiProperty({ required: false })
  createStore?: boolean;

  @ApiProperty({ required: false })
  updateStore?: boolean;

  @ApiProperty({ required: false })
  viewStore?: boolean;

  @ApiProperty({ required: false })
  deleteStore?: boolean;

  @ApiProperty({ required: false })
  viewUserManagement?: boolean;

  @ApiProperty({ required: false })
  viewOperationalStructure?: boolean;

  @ApiProperty({ required: false })
  viewProductManagement?: boolean;

  @ApiProperty({ required: false })
  viewOrderManagement?: boolean;

  @ApiProperty({ required: false })
  viewReportingAndAnalytics?: boolean;

  @ApiProperty({ required: false })
  createDeliveryZone?: boolean;

  @ApiProperty({ required: false })
  viewDeliveryZone?: boolean;

  @ApiProperty({ required: false })
  updateDeliveryZone?: boolean;

  @ApiProperty({ required: false })
  deleteDeliveryZone?: boolean;

  @ApiProperty({ required: false })
  viewCategory?: boolean;

  @ApiProperty({ required: false })
  viewProduct?: boolean;

  @ApiProperty({ required: false })
  updateProduct?: boolean;

  constructor(data: PermissionsEntity) {
    Object.assign(this, data.dataValues);
  }
}
