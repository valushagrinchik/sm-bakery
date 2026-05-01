import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DeliverySubZonesEntity,
  DeliverySubZonesTimeWorkEntity,
  DeliverySubZoneType,
  DeliveryZonesEntity,
  DeliveryZonesTimeWorkEntity,
  EntityProviders,
  EntityStatus,
  ErrorMessageEnum,
  mockDeliverySubZone,
  mockDeliveryZoneData,
  OperationError,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { DeliveryZonesService } from './delivery-zones.service';
import { DeliverySubZoneTimeWorkCreateDto } from './dto/request/delivery-sub-zone-time-work.create.dto';
import { DeliverySubZoneCreateDto } from './dto/request/delivery-sub-zone.create.dto';
import { DeliverySubZoneUpdateDto } from './dto/request/delivery-sub-zone.update.dto';
import { DeliveryZoneTimeWorkUpdateDto } from './dto/request/delivery-zone-time-work.update.dto';
import { DeliveryZoneCreateDto } from './dto/request/delivery-zone.create.dto';
import { DeliveryZoneUpdateDto } from './dto/request/delivery-zone.update.dto';

const checkDeliverySubZone = (
  deliverySubZone: DeliverySubZonesEntity,
  deliverySubZoneData: DeliverySubZoneCreateDto | DeliverySubZoneUpdateDto,
  deliveryZoneId: number,
) => {
  expect(deliverySubZone).toBeDefined();
  expect(deliverySubZone.deliveryZoneId).toEqual(deliveryZoneId);
  expect(deliverySubZone.deliveryZonePolygon).toEqual(deliverySubZoneData.deliveryZonePolygon);
  expect(deliverySubZone.type).toEqual(deliverySubZoneData.type);
};

const checkDeliveryZoneTimeWork = (
  deliveryZoneTimeWork: DeliveryZonesTimeWorkEntity | DeliverySubZonesTimeWorkEntity,
  deliveryZoneTimeWorkData: DeliverySubZoneTimeWorkCreateDto | DeliveryZoneTimeWorkUpdateDto,
) => {
  expect(deliveryZoneTimeWork).toBeDefined();
  expect(deliveryZoneTimeWork.monday).toEqual(deliveryZoneTimeWorkData.monday);
  expect(deliveryZoneTimeWork.mondayOpen).toEqual(
    deliveryZoneTimeWorkData.mondayOpen ? deliveryZoneTimeWorkData.mondayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.mondayClose).toEqual(
    deliveryZoneTimeWorkData.mondayClose ? deliveryZoneTimeWorkData.mondayClose + ':00' : null,
  );
  expect(deliveryZoneTimeWork.tuesday).toEqual(deliveryZoneTimeWorkData.tuesday);
  expect(deliveryZoneTimeWork.tuesdayOpen).toEqual(
    deliveryZoneTimeWorkData.tuesdayOpen ? deliveryZoneTimeWorkData.tuesdayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.tuesdayClose).toEqual(
    deliveryZoneTimeWorkData.tuesdayClose ? deliveryZoneTimeWorkData.tuesdayClose + ':00' : null,
  );
  expect(deliveryZoneTimeWork.wednesday).toEqual(deliveryZoneTimeWorkData.wednesday);
  expect(deliveryZoneTimeWork.wednesdayOpen).toEqual(
    deliveryZoneTimeWorkData.wednesdayOpen ? deliveryZoneTimeWorkData.wednesdayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.wednesdayClose).toEqual(
    deliveryZoneTimeWorkData.wednesdayClose
      ? deliveryZoneTimeWorkData.wednesdayClose + ':00'
      : null,
  );
  expect(deliveryZoneTimeWork.thursday).toEqual(deliveryZoneTimeWorkData.thursday);
  expect(deliveryZoneTimeWork.thursdayOpen).toEqual(
    deliveryZoneTimeWorkData.thursdayOpen ? deliveryZoneTimeWorkData.thursdayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.thursdayClose).toEqual(
    deliveryZoneTimeWorkData.thursdayClose ? deliveryZoneTimeWorkData.thursdayClose + ':00' : null,
  );
  expect(deliveryZoneTimeWork.friday).toEqual(deliveryZoneTimeWorkData.friday);
  expect(deliveryZoneTimeWork.fridayOpen).toEqual(
    deliveryZoneTimeWorkData.fridayOpen ? deliveryZoneTimeWorkData.fridayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.fridayClose).toEqual(
    deliveryZoneTimeWorkData.fridayClose ? deliveryZoneTimeWorkData.fridayClose + ':00' : null,
  );
  expect(deliveryZoneTimeWork.saturday).toEqual(deliveryZoneTimeWorkData.saturday);
  expect(deliveryZoneTimeWork.saturdayOpen).toEqual(
    deliveryZoneTimeWorkData.saturdayOpen ? deliveryZoneTimeWorkData.saturdayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.saturdayClose).toEqual(
    deliveryZoneTimeWorkData.saturdayClose ? deliveryZoneTimeWorkData.saturdayClose + ':00' : null,
  );
  expect(deliveryZoneTimeWork.sunday).toEqual(deliveryZoneTimeWorkData.sunday);
  expect(deliveryZoneTimeWork.sundayOpen).toEqual(
    deliveryZoneTimeWorkData.sundayOpen ? deliveryZoneTimeWorkData.sundayOpen + ':00' : null,
  );
  expect(deliveryZoneTimeWork.sundayClose).toEqual(
    deliveryZoneTimeWorkData.sundayClose ? deliveryZoneTimeWorkData.sundayClose + ':00' : null,
  );
};

const checkDeliveryZone = (
  deliveryZone: DeliveryZonesEntity,
  deliveryZoneData: DeliveryZoneCreateDto | DeliveryZoneUpdateDto,
) => {
  expect(deliveryZone).toBeDefined();
  expect(deliveryZone.name).toEqual(deliveryZoneData.name);
  expect(deliveryZone.countryId).toEqual(deliveryZoneData.countryId);
  expect(deliveryZone.status).toEqual(deliveryZoneData.status);
  expect(deliveryZone.minOrderAmount).toEqual(deliveryZoneData.minOrderAmount);
  expect(deliveryZone.maxOrderAmount).toEqual(deliveryZoneData.maxOrderAmount);
  expect(deliveryZone.standardDeliveryTime).toEqual(deliveryZoneData.standardDeliveryTime);
  if (deliveryZone.deliveryZonePolygon) {
    expect(deliveryZone.deliveryZonePolygon).toEqual(deliveryZoneData.deliveryZonePolygon);
  }
  if (deliveryZoneData instanceof DeliveryZoneCreateDto) {
    if (deliveryZoneData.deliveryZoneTimeWork) {
      checkDeliveryZoneTimeWork(
        deliveryZone.deliveryZoneTimeWork,
        deliveryZoneData.deliveryZoneTimeWork,
      );
    }
  }

  if (deliveryZoneData instanceof DeliveryZoneCreateDto) {
    if (deliveryZoneData.deliverySubZones) {
      deliveryZone.deliverySubZones.forEach((deliverySubZone, index) => {
        checkDeliverySubZone(
          deliverySubZone,
          deliveryZoneData.deliverySubZones[index],
          deliverySubZone.id,
        );
      });
    }
  }
};

describe('DeliveryZonesService', () => {
  let service: DeliveryZonesService;
  let transaction: Transaction;
  let countryId: number = 1;
  let deliveryZoneId: number = 1;
  let storeIds: number[] = [1, 2];

  const mockDeliveryZone = { ...mockDeliveryZoneData };

  const mockDeliveryZoneUpdate = {
    name: 'Test Delivery Zone 2',
    status: EntityStatus.ACTIVE,
    minOrderAmount: '11.99',
    maxOrderAmount: '2000.00',
    standardDeliveryTime: 15,
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
  };

  const mockDeliveryZoneTimeWorkUpdate = {
    monday: true,
    mondayOpen: '09:00',
    mondayClose: '21:00',
    tuesday: true,
    tuesdayOpen: '06:00',
    tuesdayClose: '18:00',
    wednesday: true,
    wednesdayOpen: '08:00',
    wednesdayClose: '20:00',
    thursday: false,
    thursdayOpen: null,
    thursdayClose: null,
    friday: false,
    fridayOpen: null,
    fridayClose: null,
    saturday: false,
    saturdayOpen: null,
    saturdayClose: null,
    sunday: false,
    sundayOpen: null,
    sundayClose: null,
  };

  const mockDeliverySubZoneData = [{ id: 2, ...mockDeliverySubZone }];

  const mockDeliveryZoneProvide = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
  };
  const mockDeliverySubZoneProvide = {
    findOne: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  };

  const mockDeliveryZoneTimeWorkProvide = {
    create: jest.fn(),
  };
  const mockDeliverySubZoneTimeWorkProvide = {
    create: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
  };
  const mockStoresDeliveryZoneProvide = {
    findOne: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
  };
  const mockStoresProvide = {
    update: jest.fn(),
  };

  const mockDeliveryZoneDbData = {
    ...mockDeliveryZoneData,
    countryId,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDeliveryZoneTimeWorkDbData = {
    monday: true,
    mondayOpen: '07:00:00',
    mondayClose: '19:00:00',
    tuesday: true,
    tuesdayOpen: '07:00:00',
    tuesdayClose: '19:00:00',
    wednesday: true,
    wednesdayOpen: '07:00:00',
    wednesdayClose: '19:00:00',
    thursday: true,
    thursdayOpen: '07:00:00',
    thursdayClose: '19:00:00',
    friday: true,
    fridayOpen: '07:00:00',
    fridayClose: '19:00:00',
    saturday: true,
    saturdayOpen: '07:00:00',
    saturdayClose: '19:00:00',
    sunday: true,
    sundayOpen: '07:00:00',
    sundayClose: '19:00:00',
    deliveryZoneId: 1,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDeliverySubZoneDbData = {
    ...mockDeliverySubZone,
    deliveryZoneId: 1,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDeliverySubZoneTimeWorkDbData = {
    monday: true,
    mondayOpen: '07:00:00',
    mondayClose: '19:00:00',
    tuesday: true,
    tuesdayOpen: '07:00:00',
    tuesdayClose: '19:00:00',
    wednesday: true,
    wednesdayOpen: '07:00:00',
    wednesdayClose: '19:00:00',
    thursday: true,
    thursdayOpen: '07:00:00',
    thursdayClose: '19:00:00',
    friday: true,
    fridayOpen: '07:00:00',
    fridayClose: '19:00:00',
    saturday: true,
    saturdayOpen: '07:00:00',
    saturdayClose: '19:00:00',
    sunday: true,
    sundayOpen: '07:00:00',
    sundayClose: '19:00:00',
    deliverySubZoneId: 1,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryZonesService,
        { provide: EntityProviders.DELIVERY_ZONES_PROVIDER, useValue: mockDeliveryZoneProvide },
        {
          provide: EntityProviders.DELIVERY_SUB_ZONES_PROVIDER,
          useValue: mockDeliverySubZoneProvide,
        },
        {
          provide: EntityProviders.DELIVERY_ZONES_TIME_WORK_PROVIDER,
          useValue: mockDeliveryZoneTimeWorkProvide,
        },
        {
          provide: EntityProviders.DELIVERY_SUB_ZONES_TIME_WORK_PROVIDER,
          useValue: mockDeliverySubZoneTimeWorkProvide,
        },
        {
          provide: EntityProviders.STORE_DELIVERY_ZONES_PROVIDER,
          useValue: mockStoresDeliveryZoneProvide,
        },
        {
          provide: EntityProviders.STORES_PROVIDER,
          useValue: mockStoresProvide,
        },
      ],
    }).compile();

    service = module.get<DeliveryZonesService>(DeliveryZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('delivery zone CRUD tests', () => {
    it('should be created delivery zone', async () => {
      mockDeliveryZoneProvide.count.mockResolvedValue(0);
      mockDeliveryZoneProvide.create.mockResolvedValue(mockDeliveryZoneDbData);
      mockDeliveryZoneTimeWorkProvide.create.mockResolvedValue(mockDeliveryZoneTimeWorkDbData);
      mockDeliveryZoneProvide.findByPk.mockResolvedValue(mockDeliveryZoneDbData);
      mockDeliverySubZoneProvide.bulkCreate.mockResolvedValue([mockDeliverySubZoneDbData]);
      mockDeliverySubZoneTimeWorkProvide.bulkCreate.mockResolvedValue([
        mockDeliverySubZoneTimeWorkDbData,
      ]);

      const deliveryZoneData = { countryId, ...mockDeliveryZone };

      const deliveryZone = await service.create(
        transaction,
        deliveryZoneData as unknown as DeliveryZoneCreateDto,
      );

      checkDeliveryZone(deliveryZone, deliveryZoneData as unknown as DeliveryZoneCreateDto);
    });

    it('should be get delivery zone by id', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue(mockDeliveryZoneDbData);
      const deliveryZoneData = { countryId, ...mockDeliveryZone };

      const deliveryZone = await service.getById(deliveryZoneId);

      checkDeliveryZone(deliveryZone, deliveryZoneData as unknown as DeliveryZoneCreateDto);
    });

    it('should be get error delivery_zone_not_found ', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue(null);
      try {
        await service.getById(2);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should be update delivery zone by id', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [],
        update: jest.fn(),
      });

      const deliveryZoneData = { countryId, ...mockDeliveryZoneUpdate };

      expect(
        await service.update(
          transaction,
          deliveryZoneId,
          deliveryZoneData as unknown as DeliveryZoneUpdateDto,
        ),
      ).toBe(void 0);
    });

    it('should be get delivery zone by id after update', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        ...mockDeliveryZoneUpdate,
      });

      const deliveryZoneData = { countryId, ...mockDeliveryZoneUpdate };

      const deliveryZone = await service.getById(deliveryZoneId);

      checkDeliveryZone(deliveryZone, deliveryZoneData as unknown as DeliveryZoneUpdateDto);
    });

    it('should be get delivery zone lists', async () => {
      mockDeliveryZoneProvide.findAndCountAll.mockResolvedValue({
        rows: [{ dataValues: mockDeliveryZoneDbData }],
        count: 1,
      });

      const deliveryZoneLists = await service.deliveryZoneList({ limit: 10, offset: 0 });

      expect(deliveryZoneLists).toBeDefined();
      expect(deliveryZoneLists.result).not.toHaveLength(0);
      expect(deliveryZoneLists.count).toEqual(1);
    });

    it('should be update delivery zone time work', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliveryZoneTimeWork: { update: jest.fn() },
      });
      expect(
        await service.updateDeliveryZoneTimeWork(
          transaction,
          deliveryZoneId,
          mockDeliveryZoneTimeWorkUpdate,
        ),
      ).toBe(void 0);
    });

    it('should be get delivery zone by id after update time work', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliveryZoneTimeWork: {
          ...mockDeliveryZoneTimeWorkDbData,
          monday: true,
          mondayOpen: '09:00:00',
          mondayClose: '21:00:00',
          tuesday: true,
          tuesdayOpen: '06:00:00',
          tuesdayClose: '18:00:00',
          wednesday: true,
          wednesdayOpen: '08:00:00',
          wednesdayClose: '20:00:00',
          thursday: false,
          thursdayOpen: null,
          thursdayClose: null,
          friday: false,
          fridayOpen: null,
          fridayClose: null,
          saturday: false,
          saturdayOpen: null,
          saturdayClose: null,
          sunday: false,
          sundayOpen: null,
          sundayClose: null,
        },
      });
      const deliveryZone = await service.getById(deliveryZoneId);

      checkDeliveryZoneTimeWork(deliveryZone.deliveryZoneTimeWork, mockDeliveryZoneTimeWorkUpdate);
    });

    it('should be assignee store in delivery zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [],
        update: jest.fn(),
      });
      mockStoresDeliveryZoneProvide.findOne.mockResolvedValue({ update: jest.fn() });

      expect(
        await service.update(transaction, deliveryZoneId, {
          countryId,
          stores: [
            { storeId: storeIds[0], isMainStore: true },
            { storeId: storeIds[1], isMainStore: false },
          ],
          ...mockDeliveryZoneUpdate,
        }),
      ).toBe(void 0);
    });

    it('should be change main store in delivery zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [],
        update: jest.fn(),
      });
      mockStoresDeliveryZoneProvide.findOne.mockResolvedValue({ update: jest.fn() });
      expect(
        await service.changeMainStore(transaction, deliveryZoneId, { storeId: storeIds[1] }),
      ).toBe(void 0);
    });

    it('should be check change main store in delivery zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [{ isMainStore: false }, { isMainStore: true }],
        update: jest.fn(),
      });
      const deliveryZone = await service.getById(deliveryZoneId);

      if (deliveryZone.storeDeliveryZones) {
        expect(deliveryZone.storeDeliveryZones[0].isMainStore).toEqual(false);
        expect(deliveryZone.storeDeliveryZones[1].isMainStore).toEqual(true);
      } else {
        fail('storeDeliveryZones not found');
      }
    });

    it('should be assignee new store and delete old in delivery zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [
          { storeId: storeIds[0], isMainStore: false },
          { storeId: storeIds[1], isMainStore: true },
        ],
        update: jest.fn(),
      });
      mockStoresDeliveryZoneProvide.findOne.mockResolvedValue({ update: jest.fn() });
      expect(
        await service.update(transaction, deliveryZoneId, {
          countryId,
          stores: [
            { storeId: 3, isMainStore: true },
            { storeId: storeIds[1], isMainStore: false },
          ],
          ...mockDeliveryZoneUpdate,
        }),
      ).toBe(void 0);
    });

    it('should be check change store in delivery zone after change store', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [
          { storeId: storeIds[0], isMainStore: false },
          { storeId: storeIds[1], isMainStore: true },
        ],
        update: jest.fn(),
      });

      const deliveryZone = await service.getById(deliveryZoneId);

      if (deliveryZone.storeDeliveryZones) {
        expect(deliveryZone.storeDeliveryZones).toHaveLength(2);
        expect(deliveryZone.storeDeliveryZones[0].isMainStore).toEqual(false);
        expect(deliveryZone.storeDeliveryZones[1].isMainStore).toEqual(true);
      } else {
        fail('storeDeliveryZones not found');
      }
    });

    it('should be get error mast_be_only_one_main_store', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [
          { storeId: storeIds[0], isMainStore: false },
          { storeId: storeIds[1], isMainStore: true },
        ],
        update: jest.fn(),
      });
      try {
        await service.update(transaction, deliveryZoneId, {
          countryId,
          stores: [
            { storeId: storeIds[2], isMainStore: true },
            { storeId: storeIds[1], isMainStore: true },
          ],
          ...mockDeliveryZoneUpdate,
        });

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.MAST_BE_ONLY_ONE_MAIN_STORE);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be validate address', async () => {
      mockDeliveryZoneProvide.findOne.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [
          { storeId: storeIds[0], isMainStore: false },
          { storeId: storeIds[1], isMainStore: true },
        ],
        update: jest.fn(),
      });

      mockDeliverySubZoneProvide.findOne.mockResolvedValue(null);

      const query = { lat: 14.67199510765211, lng: -90.58266153606995 };

      const deliveryZone = await service.fastValidateAddress(query);

      expect(deliveryZone).toEqual(true);
    });

    it('should be validate delivery address', async () => {
      mockDeliveryZoneProvide.findOne.mockResolvedValue({
        dataValues: {
          ...mockDeliveryZoneDbData,
          ...mockDeliveryZoneUpdate,
          storeDeliveryZones: [
            { id: 1, storeId: storeIds[0], isMainStore: false, store: { id: 1, name: 'Store 1' } },
            { id: 2, storeId: storeIds[1], isMainStore: true, store: { id: 2, name: 'Store 2' } },
          ],
        },
      });

      mockDeliverySubZoneProvide.findOne.mockResolvedValue(null);

      const query = { lat: 14.67199510765211, lng: -90.58266153606995 };

      const deliveryZone = await service.validateDeliveryAddress(query);

      const deliveryZoneData = { countryId, ...mockDeliveryZoneUpdate };
      checkDeliveryZone(
        deliveryZone.deliveryZone as unknown as DeliveryZonesEntity,
        deliveryZoneData as unknown as DeliveryZoneUpdateDto,
      );
    });

    it('should be get all polygons', async () => {
      mockDeliveryZoneProvide.findAll.mockResolvedValue([
        {
          ...mockDeliveryZoneDbData,
          ...mockDeliveryZoneUpdate,
          storeDeliveryZones: [
            { id: 1, storeId: storeIds[0], isMainStore: false, store: { id: 1, name: 'Store 1' } },
            { id: 2, storeId: storeIds[1], isMainStore: true, store: { id: 2, name: 'Store 2' } },
          ],
        },
      ]);

      const allPolygons = await service.getAllPolygons({ countryId });

      if (allPolygons.length === 0) {
        fail('Polygon is empty');
      }

      allPolygons.forEach((polygon) => {
        polygon.deliveryZonePolygon.forEach((zone, index) => {
          expect(zone.lat).toEqual(mockDeliveryZoneUpdate.deliveryZonePolygon[index].lat);
          expect(zone.lng).toEqual(mockDeliveryZoneUpdate.deliveryZonePolygon[index].lng);
        });
      });
    });

    it('should be deleted delivery zone by id', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        storeDeliveryZones: [],
        destroy: jest.fn(),
        deliveryZoneTimeWork: { ...mockDeliveryZoneTimeWorkDbData, destroy: jest.fn() },
      });
      expect(await service.delete(transaction, deliveryZoneId)).toBe(void 0);
    });

    it('should be get error delivery_zone_not_found after delete delivery zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue(null);
      try {
        await service.getById(deliveryZoneId);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('delivery sub zone tests', () => {
    it('should be create new delivery sub zone', async () => {
      mockDeliverySubZoneProvide.findAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockDeliverySubZoneDbData]);
      mockDeliverySubZoneProvide.bulkCreate.mockResolvedValue([mockDeliverySubZoneDbData]);

      const deliverySubZoneBody = [
        ...mockDeliverySubZoneData,
        {
          deliveryZonePolygon: [
            { lat: 36.774, lng: -90.19 },
            { lat: 28.466, lng: -76.118 },
            { lat: 42.321, lng: -74.757 },
          ],
          type: DeliverySubZoneType.DENY_SERVICE,
        },
      ];
      expect(
        await service.deliverySubZone(
          transaction,
          deliveryZoneId,
          deliverySubZoneBody as DeliverySubZoneUpdateDto[],
        ),
      ).toBe(void 0);
    });

    it('should be get delivery sub zone after create new sub zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliverySubZones: [mockDeliverySubZoneDbData],
      });

      const deliverySubZoneBody = [
        ...mockDeliverySubZoneData,
        {
          deliveryZonePolygon: [
            { lat: 36.774, lng: -90.19 },
            { lat: 28.466, lng: -76.118 },
            { lat: 42.321, lng: -74.757 },
          ],
          type: DeliverySubZoneType.DENY_SERVICE,
        },
      ];

      const deliveryZone = await service.getById(deliveryZoneId);

      expect(deliveryZone.deliverySubZones).toHaveLength(1);
      deliveryZone.deliverySubZones.forEach((deliverySubZone, index) => {
        checkDeliverySubZone(deliverySubZone, deliverySubZoneBody[index], deliveryZone.id);
      });
    });

    it('should be update delivery sub zone', async () => {
      mockDeliverySubZoneProvide.findAll.mockResolvedValueOnce([mockDeliverySubZoneDbData]);

      const deliverySubZoneBody = [
        {
          id: 1,
          deliveryZonePolygon: [
            { lat: 15.774, lng: -70.19 },
            { lat: 8.466, lng: -56.118 },
            { lat: 22.321, lng: -54.757 },
          ],
          type: DeliverySubZoneType.RESTRICTED_HOURS,
        },
        {
          id: 2,
          deliveryZonePolygon: [
            { lat: 26.774, lng: -80.19 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
          ],
          type: DeliverySubZoneType.DENY_SERVICE,
        },
      ];
      expect(
        await service.deliverySubZone(
          transaction,
          deliveryZoneId,
          deliverySubZoneBody as DeliverySubZoneUpdateDto[],
        ),
      ).toBe(void 0);
    });

    it('should be get delivery sub zone after update sub zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliverySubZones: [
          {
            ...mockDeliverySubZoneDbData,
            deliveryZonePolygon: [
              { lat: 15.774, lng: -70.19 },
              { lat: 8.466, lng: -56.118 },
              { lat: 22.321, lng: -54.757 },
            ],
            type: DeliverySubZoneType.RESTRICTED_HOURS,
          },
          {
            id: 2,
            deliveryZoneId: 1,
            deliveryZonePolygon: [
              { lat: 26.774, lng: -80.19 },
              { lat: 18.466, lng: -66.118 },
              { lat: 32.321, lng: -64.757 },
            ],
            type: DeliverySubZoneType.DENY_SERVICE,
          },
        ],
      });

      const deliverySubZoneBody = [
        {
          id: 1,
          deliveryZonePolygon: [
            { lat: 15.774, lng: -70.19 },
            { lat: 8.466, lng: -56.118 },
            { lat: 22.321, lng: -54.757 },
          ],
          type: DeliverySubZoneType.RESTRICTED_HOURS,
        },
        {
          id: 2,
          deliveryZonePolygon: [
            { lat: 26.774, lng: -80.19 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
          ],
          type: DeliverySubZoneType.DENY_SERVICE,
        },
      ];

      const deliveryZone = await service.getById(deliveryZoneId);

      expect(deliveryZone.deliverySubZones).toHaveLength(2);
      deliveryZone.deliverySubZones.forEach((deliverySubZone, index) => {
        checkDeliverySubZone(deliverySubZone, deliverySubZoneBody[index], deliveryZone.id);
      });
    });

    it('should be delete delivery sub zone', async () => {
      mockDeliverySubZoneProvide.findAll.mockResolvedValue([
        {
          ...mockDeliverySubZoneDbData,
          deliveryZonePolygon: [
            { lat: 15.774, lng: -70.19 },
            { lat: 8.466, lng: -56.118 },
            { lat: 22.321, lng: -54.757 },
          ],
          type: DeliverySubZoneType.RESTRICTED_HOURS,
        },
        {
          id: 2,
          deliveryZoneId: 1,
          deliveryZonePolygon: [
            { lat: 26.774, lng: -80.19 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
          ],
          type: DeliverySubZoneType.DENY_SERVICE,
        },
      ]);

      const deliverySubZoneBody = [
        {
          id: 2,
          deliveryZonePolygon: [
            { lat: 15.774, lng: -70.19 },
            { lat: 8.466, lng: -56.118 },
            { lat: 22.321, lng: -54.757 },
          ],
          type: DeliverySubZoneType.RESTRICTED_HOURS,
        },
      ];
      expect(
        await service.deliverySubZone(
          transaction,
          deliveryZoneId,
          deliverySubZoneBody as DeliverySubZoneUpdateDto[],
        ),
      ).toBe(void 0);
    });

    it('should be get delivery sub zone after delete sub zone', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliverySubZones: [
          {
            id: 2,
            deliveryZoneId: 1,
            deliveryZonePolygon: [
              { lat: 15.774, lng: -70.19 },
              { lat: 8.466, lng: -56.118 },
              { lat: 22.321, lng: -54.757 },
            ],
            type: DeliverySubZoneType.RESTRICTED_HOURS,
          },
        ],
      });

      const deliverySubZoneBody = [
        {
          id: 2,
          deliveryZonePolygon: [
            { lat: 15.774, lng: -70.19 },
            { lat: 8.466, lng: -56.118 },
            { lat: 22.321, lng: -54.757 },
          ],
          type: DeliverySubZoneType.RESTRICTED_HOURS,
        },
      ];

      const deliveryZone = await service.getById(deliveryZoneId);

      expect(deliveryZone.deliverySubZones).toHaveLength(1);
      deliveryZone.deliverySubZones.forEach((deliverySubZone, index) => {
        checkDeliverySubZone(deliverySubZone, deliverySubZoneBody[index], deliveryZone.id);
      });
    });

    it('should be update delivery sub zone time work', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliverySubZones: [
          {
            id: 2,
            deliveryZoneId: 1,
            deliveryZonePolygon: [
              { lat: 15.774, lng: -70.19 },
              { lat: 8.466, lng: -56.118 },
              { lat: 22.321, lng: -54.757 },
            ],
            type: DeliverySubZoneType.RESTRICTED_HOURS,
          },
        ],
      });

      mockDeliverySubZoneProvide.findByPk.mockResolvedValue({
        id: 2,
        deliveryZoneId: 1,
        deliveryZonePolygon: [
          { lat: 26.774, lng: -80.19 },
          { lat: 18.466, lng: -66.118 },
          { lat: 32.321, lng: -64.757 },
        ],
        type: DeliverySubZoneType.RESTRICTED_HOURS,
        deliverySubZoneTimeWork: {
          ...mockDeliverySubZoneTimeWorkDbData,
          deliverySubZoneId: 2,
          update: jest.fn(),
        },
      });

      expect(
        await service.updateDeliverySubZoneTimeWork(
          transaction,
          deliveryZoneId,
          2,
          mockDeliveryZoneTimeWorkUpdate,
        ),
      ).toBe(void 0);
    });

    it('should be check update delivery sub zone time work', async () => {
      mockDeliveryZoneProvide.findByPk.mockResolvedValue({
        ...mockDeliveryZoneDbData,
        deliverySubZones: [
          {
            id: 2,
            deliveryZoneId: 1,
            deliveryZonePolygon: [
              { lat: 15.774, lng: -70.19 },
              { lat: 8.466, lng: -56.118 },
              { lat: 22.321, lng: -54.757 },
            ],
            type: DeliverySubZoneType.RESTRICTED_HOURS,
            deliverySubZoneTimeWork: {
              monday: true,
              mondayOpen: '09:00:00',
              mondayClose: '21:00:00',
              tuesday: true,
              tuesdayOpen: '06:00:00',
              tuesdayClose: '18:00:00',
              wednesday: true,
              wednesdayOpen: '08:00:00',
              wednesdayClose: '20:00:00',
              thursday: false,
              thursdayOpen: null,
              thursdayClose: null,
              friday: false,
              fridayOpen: null,
              fridayClose: null,
              saturday: false,
              saturdayOpen: null,
              saturdayClose: null,
              sunday: false,
              sundayOpen: null,
              sundayClose: null,
              deliverySubZoneId: 2,
            },
          },
        ],
      });

      const deliveryZone = await service.getById(deliveryZoneId);
      expect(deliveryZone.deliverySubZones).toHaveLength(1);
      checkDeliveryZoneTimeWork(
        deliveryZone.deliverySubZones[0].deliverySubZoneTimeWork,
        mockDeliveryZoneTimeWorkUpdate,
      );
    });
  });
});
