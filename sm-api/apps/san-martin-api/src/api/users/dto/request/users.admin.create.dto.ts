import { ApiProperty } from '@nestjs/swagger';
import {
  TypeValidate,
  Validate,
  ValidateEnum,
  RoleId,
  AdminUserStatus,
  UserStatus,
} from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';
export class UsersAdminCreateDto {
  @Validate(TypeValidate.STRING)
  firstName: string;

  @Validate(TypeValidate.STRING)
  lastName: string;

  @Validate(TypeValidate.STRING, { required: false })
  avatar?: string;

  @Validate(TypeValidate.STRING)
  phone: string;

  @Validate(TypeValidate.EMAIL)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Validate(TypeValidate.NUMBER)
  @ValidateIf((o) => {
    return o.role !== RoleId.SuperAdmin;
  })
  @ApiProperty({ description: 'optional for SuperAdmin' })
  countryId?: number;

  @Validate(TypeValidate.NUMBER)
  @ValidateIf((o) => [RoleId.StoreManager].includes(o.role))
  @ApiProperty({ description: 'requires only for StoreManager and Operator' })
  storeId?: number;

  @Validate(TypeValidate.NUMBER)
  @ValidateIf((o) => o.role == RoleId.DeliveryMan)
  @ApiProperty({ description: 'requires only for DeliveryMan' })
  deliveryZoneId?: number;

  @ValidateEnum(RoleId, {
    enum: RoleId,
  })
  roleId: RoleId;

  @ValidateEnum(AdminUserStatus, {
    enumName: 'AdminUserStatus',
    enum: AdminUserStatus,
  })
  status?: UserStatus;
}
