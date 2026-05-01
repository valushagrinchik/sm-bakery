import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class AllPolygonsQueryDto {
  @Validate(TypeValidate.NUMBER)
  countryId: number;
}
