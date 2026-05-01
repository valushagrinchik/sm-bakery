import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity, UserStatus } from '@san-martin/san-martin-libs';

import { CustomerResponseDto } from './customer.response.dto';
import { OperatorResponseDto } from './operator.response.dto';
import { RoleResponseDto } from '../../../roles/dto/response/role.response.dto';

export class UserResponseDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  roleId?: number;

  @ApiProperty({ required: false, type: RoleResponseDto })
  role?: RoleResponseDto;

  @ApiProperty({ required: false })
  countryId?: number;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  verified?: boolean;

  @ApiProperty({ required: false })
  phoneVerified?: boolean;

  @ApiProperty({ required: false, enum: UserStatus, enumName: 'UserStatus' })
  status?: UserStatus;

  @ApiProperty({ required: false })
  isOnline?: boolean;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  customer?: CustomerResponseDto;

  @ApiProperty({ required: false })
  operator?: OperatorResponseDto;

  constructor(data: UsersEntity) {
    Object.assign(this, data.dataValues);

    if (data.role) {
      this.role = new RoleResponseDto(data.role);
    }

    if (data.customer) {
      this.customer = new CustomerResponseDto(data.customer);
    }

    if (data.operator) {
      this.operator = new OperatorResponseDto(data.operator);
    }
  }
}
