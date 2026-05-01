import { TypeValidate, Validate, ValidateEnum, WeekName } from '@san-martin/san-martin-libs';
import { Transform } from 'class-transformer';

export class ListOrderPerHoursDto {
  @Validate(TypeValidate.TIME_PERIOD, { required: true, example: '06:00-06:30' })
  timePeriod: string;

  @Validate(TypeValidate.NUMBER)
  maxOrderAmount: number;
}

export class StoreOrderPerHoursDto {
  @ValidateEnum(WeekName, { enum: WeekName, enumName: 'WeekName' })
  weekName: WeekName;

  @Validate(TypeValidate.ARRAY, { type: [ListOrderPerHoursDto] })
  @Transform(({ value }) =>
    value.map((item: ListOrderPerHoursDto) => ({
      timePeriod: item.timePeriod,
      maxOrderAmount: item.maxOrderAmount,
    })),
  )
  listOrderPerHours: ListOrderPerHoursDto[];
}
