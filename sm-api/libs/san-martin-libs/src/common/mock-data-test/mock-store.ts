import { EntityStatus } from '../enums/entity-status';

export const mockStoreData = {
  inventoryId: 'aaaaaaaaa',
  name: 'Test Stores',
  status: EntityStatus.ACTIVE,
  servicePhone: '+5023458909',
  standardDeliveryTime: 15,
  maxOrderLag: 15,
  address: 'somewhere far away',
  positionLat: 53.8936457,
  positionLng: 30.4621171,
};
