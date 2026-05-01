import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppConfigService, entityProviders } from '@san-martin/san-martin-libs';

import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [HttpModule],
  controllers: [StoresController],
  providers: [
    StoresService,
    AppConfigService,
    ...entityProviders.storesProvider,
    ...entityProviders.storesTimeWorkProvider,
    ...entityProviders.storeDeliveryZonesProvider,
    ...entityProviders.storeOrderPerHoursProvider,
  ],
  exports: [
    StoresService,
    ...entityProviders.storesProvider,
    ...entityProviders.storesTimeWorkProvider,
    ...entityProviders.storeDeliveryZonesProvider,
    ...entityProviders.storeOrderPerHoursProvider,
  ],
})
export class StoresModule {}
