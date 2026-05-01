import { TypeValidate, Validate } from '../../decorators/validation';
import { BaseQueryParams } from '../../types/base-query-type';

export class FindManyQueryDto implements BaseQueryParams {
  @Validate(TypeValidate.STRING, { required: false })
  search?: string;

  @Validate(TypeValidate.NUMBER, {
    required: false,
    default: 0,
    description: 'Offset selected rows.',
  })
  offset: number = 0;

  @Validate(TypeValidate.NUMBER, {
    required: false,
    default: 10,
    description: 'Limit selected rows.',
  })
  limit: number = 10;
}

export class FindOneParamsDto {
  @Validate(TypeValidate.NUMBER)
  id: number;
}

export class TimeWorkCreateDto {
  @Validate(TypeValidate.BOOLEAN)
  monday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  mondayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  mondayClose?: string;
  @Validate(TypeValidate.BOOLEAN)
  tuesday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  tuesdayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  tuesdayClose?: string;
  @Validate(TypeValidate.BOOLEAN)
  wednesday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  wednesdayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  wednesdayClose?: string;
  @Validate(TypeValidate.BOOLEAN)
  thursday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  thursdayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  thursdayClose?: string;
  @Validate(TypeValidate.BOOLEAN)
  friday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  fridayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  fridayClose?: string;
  @Validate(TypeValidate.BOOLEAN)
  saturday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  saturdayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  saturdayClose?: string;
  @Validate(TypeValidate.BOOLEAN)
  sunday: boolean;
  @Validate(TypeValidate.TIME, { required: false })
  sundayOpen?: string;
  @Validate(TypeValidate.TIME, { required: false })
  sundayClose?: string;
}
