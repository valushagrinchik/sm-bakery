import { ApiProperty } from '@nestjs/swagger';
import { RolesEntity } from '@san-martin/san-martin-libs';

import { PermissionResponseDto } from './permission.response.dto';

export class RoleResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  isDefault?: boolean;

  @ApiProperty({ required: false })
  customerAppAccess?: boolean;

  @ApiProperty({ required: false })
  operatorAppAccess?: boolean;

  @ApiProperty({ required: false })
  adminPanelAccess?: boolean;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false, type: PermissionResponseDto })
  permission?: PermissionResponseDto;

  constructor(data: RolesEntity) {
    Object.assign(this, data.dataValues);

    if (data.permission) {
      this.permission = new PermissionResponseDto(data.permission);
    }
  }
}
