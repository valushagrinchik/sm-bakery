import {
  EntityStatus,
  FindManyQueryDto,
  SortOrder,
  ToBoolean,
  TypeValidate,
  Validate,
  ValidateEnum,
} from '@san-martin/san-martin-libs';
import { ValidateNested } from 'class-validator';

export class DeliveryZoneSortDto {
  @ValidateEnum(SortOrder, {
    required: false,
    enum: SortOrder,
    enumName: 'SortOrder',
    name: 'sort[status]',
  })
  status?: SortOrder;

  @ValidateEnum(SortOrder, {
    required: false,
    enum: SortOrder,
    enumName: 'SortOrder',
    name: 'sort[name]',
  })
  name?: SortOrder;
}

export class DeliveryZoneFindManyDto extends FindManyQueryDto {
  @ValidateEnum(EntityStatus, { required: false, enum: EntityStatus, enumName: 'EntityStatus' })
  status?: EntityStatus;

  @Validate(TypeValidate.NUMBER, { required: false })
  countryId?: number;

  @Validate(TypeValidate.NUMBER, { required: false })
  storeId?: number;

  @ValidateNested()
  @Validate(TypeValidate.OBJECT, { required: false })
  sort?: DeliveryZoneSortDto;

  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, {
    required: false,
    description:
      'This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name )',
  })
  isFilter?: boolean;
}
