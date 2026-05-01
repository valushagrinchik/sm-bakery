import { Module } from '@nestjs/common';
import { entityProviders } from '@san-martin/san-martin-libs';

import { DeliveryZonesAdminController } from './delivery-zones-admin.controller';
import { DeliveryZonesController } from './delivery-zones.controller';
import { DeliveryZonesService } from './delivery-zones.service';

@Module({
  providers: [
    DeliveryZonesService,
    ...entityProviders.deliveryZoneProvider,
    ...entityProviders.deliverySubZoneProvider,
    ...entityProviders.deliveryZoneTimeWorkProvider,
    ...entityProviders.deliverySubZoneTimeWorkProvider,
    ...entityProviders.storeDeliveryZonesProvider,
    ...entityProviders.storesProvider,
  ],
  exports: [
    DeliveryZonesService,
    ...entityProviders.deliveryZoneProvider,
    ...entityProviders.deliverySubZoneProvider,
    ...entityProviders.deliveryZoneTimeWorkProvider,
    ...entityProviders.deliverySubZoneTimeWorkProvider,
    ...entityProviders.storeDeliveryZonesProvider,
    ...entityProviders.storesProvider,
  ],
  controllers: [DeliveryZonesAdminController, DeliveryZonesController],
})
export class DeliveryZonesModule {}
