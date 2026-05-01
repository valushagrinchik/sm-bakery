import { OmitType } from '@nestjs/swagger';
import { FindManyQueryDto, ToBoolean, TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class RolesFindManyQueryDto extends OmitType(FindManyQueryDto, ['search'] as const) {
  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, {
    required: false,
    description:
      'This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name )',
  })
  isFilter?: boolean;
}
