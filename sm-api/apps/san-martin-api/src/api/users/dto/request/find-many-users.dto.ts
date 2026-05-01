import {
  FindManyQueryDto,
  RoleId,
  ToBoolean,
  TypeValidate,
  UserStatus,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';
import { IsOptional } from 'class-validator';

export class FindManyUsersDto extends FindManyQueryDto {
  @Validate(TypeValidate.NUMBER, { required: false })
  countryId: number;

  @ValidateEnum(UserStatus, { required: false, enum: UserStatus })
  @IsOptional()
  status?: UserStatus;

  @Validate(TypeValidate.STRING, { required: false, enum: RoleId })
  @IsOptional()
  roleId?: RoleId;

  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  @IsOptional()
  isOperator?: boolean;

  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  @IsOptional()
  isCustomer?: boolean;
}
