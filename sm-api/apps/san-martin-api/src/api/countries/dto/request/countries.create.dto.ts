import { EntityStatus, TypeValidate, Validate, ValidateEnum } from '@san-martin/san-martin-libs';

export class CountriesCreateDto {
  @Validate(TypeValidate.STRING)
  name: string;

  @Validate(TypeValidate.STRING)
  code: string;

  @Validate(TypeValidate.STRING)
  phoneCode: string;

  @Validate(TypeValidate.STRING)
  currency: string;

  @ValidateEnum(EntityStatus, { required: false })
  status?: EntityStatus = EntityStatus.INACTIVE;

  @Validate(TypeValidate.STRING, { required: false })
  inventoryId?: string;
}
