import { mockTimeWorkData } from './mock-time-work';
import { EntityStatus } from '../enums/entity-status';
import { DeliverySubZoneType } from '../types/delivery-sub-zone-type';

export const mockDeliverySubZone = {
  deliveryZonePolygon: [
    {
      lat: 14.649945700977883,
      lng: -90.5349061197876,
    },
    {
      lat: 14.647371438020091,
      lng: -90.53209516474,
    },
    {
      lat: 14.64652026377888,
      lng: -90.53585025736085,
    },
  ],
  type: DeliverySubZoneType.RESTRICTED_HOURS,
  deliverySubZoneTimeWork: mockTimeWorkData,
};

export const mockDeliveryZoneData = {
  name: 'Test Delivery Zone',
  status: EntityStatus.ACTIVE,
  minOrderAmount: '10.99',
  maxOrderAmount: '3000.00',
  standardDeliveryTime: 45,
  deliveryZonePolygon: [
    {
      lat: 14.612989675721762,
      lng: -90.53434822031252,
    },
    {
      lat: 14.668795027490017,
      lng: -90.61880561777345,
    },
    {
      lat: 14.743180028191308,
      lng: -90.5556342310547,
    },
    {
      lat: 14.664145124113368,
      lng: -90.43341133066409,
    },
    {
      lat: 14.582423592353294,
      lng: -90.48147651621096,
    },
  ],
  deliveryZoneTimeWork: mockTimeWorkData,
  deliverySubZones: [mockDeliverySubZone],
};
