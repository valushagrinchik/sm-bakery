import { OmitType, PartialType } from '@nestjs/swagger';

import { StoresCreateDto } from './stores.create.dto';

export class StoresUpdateDto extends OmitType(PartialType(StoresCreateDto), [
  'storeTimeWork',
  'address',
  'positionLng',
  'positionLat',
  'deliveryZoneId',
  'isMainStore',
  'storeOrderPerHours',
] as const) {}
