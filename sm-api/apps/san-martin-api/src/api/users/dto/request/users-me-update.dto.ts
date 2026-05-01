import { OmitType, PartialType } from '@nestjs/swagger';
import { TypeValidate, Validate } from '@san-martin/san-martin-libs';
import { IsOptional, Matches, MinLength } from 'class-validator';

import { UsersAdminUpdateDto } from './users.admin.update.dto';

export class UsersMeUpdateDto extends PartialType(
  OmitType(UsersAdminUpdateDto, ['storeId', 'roleId', 'status'] as const),
) {
  @Validate(TypeValidate.DATE, {
    required: false,
    type: String,
    example: '1996-01-01',
  })
  @IsOptional()
  birthday?: string;

  @Validate(TypeValidate.STRING, {
    required: false,
    type: String,
    example: '123456Aa!',
  })
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=\- ]+$/)
  @IsOptional()
  password?: string;
}
