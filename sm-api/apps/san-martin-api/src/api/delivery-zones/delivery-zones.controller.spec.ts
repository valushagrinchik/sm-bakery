import { Test, TestingModule } from '@nestjs/testing';
import { entityProviders, TransactionInspectors } from '@san-martin/san-martin-libs';

import { DeliveryZonesController } from './delivery-zones.controller';
import { DeliveryZonesService } from './delivery-zones.service';

describe('DeliveryZonesController', () => {
  let controller: DeliveryZonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryZonesController],
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

    controller = module.get<DeliveryZonesController>(DeliveryZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
