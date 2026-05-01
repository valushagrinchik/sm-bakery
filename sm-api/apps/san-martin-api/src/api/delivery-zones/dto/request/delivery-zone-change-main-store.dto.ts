import { TypeValidate, Validate } from '@san-martin/san-martin-libs';

export class DeliveryZoneChangeMainStoreDto {
  @Validate(TypeValidate.NUMBER)
  storeId: number;
}
