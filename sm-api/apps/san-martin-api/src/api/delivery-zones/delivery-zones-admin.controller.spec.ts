import { Test, TestingModule } from '@nestjs/testing';
import { entityProviders, TransactionInspectors } from '@san-martin/san-martin-libs';

import { DeliveryZonesAdminController } from './delivery-zones-admin.controller';
import { DeliveryZonesService } from './delivery-zones.service';

describe('DeliveryZonesAdminController', () => {
  let controller: DeliveryZonesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryZonesAdminController],
      providers: [
        DeliveryZonesService,
        ...entityProviders.deliveryZoneProvider,
        ...entityProviders.deliverySubZoneProvider,
        ...entityProviders.deliveryZoneTimeWorkProvider,
        ...entityProviders.deliverySubZoneTimeWorkProvider,
        ...entityProviders.storeDeliveryZonesProvider,
        ...entityProviders.storesProvider,
      ],
    })
      .overrideInterceptor(TransactionInspectors)
      .useValue({})
      .compile();

    controller = module.get<DeliveryZonesAdminController>(DeliveryZonesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
