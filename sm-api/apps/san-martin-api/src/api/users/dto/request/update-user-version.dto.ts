import { OsPlatform, TypeValidate, Validate, ValidateEnum } from '@san-martin/san-martin-libs';
import { Matches } from 'class-validator';

export class UpdateUserVersionDto {
  @Validate(TypeValidate.STRING)
  @Matches(/^[0-9]{1,2}(\.[0-9]{1,2}){0,2}$/)
  version: string;

  @ValidateEnum(OsPlatform)
  os: OsPlatform;
}
