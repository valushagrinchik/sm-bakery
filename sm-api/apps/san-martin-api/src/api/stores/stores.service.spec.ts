import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigModule,
  AppConfigService,
  EntityProviders,
  EntityStatus,
  ErrorMessageEnum,
  mockStoreData,
  mockTimeWorkData,
  OperationError,
  StoresEntity,
  WeekName,
} from '@san-martin/san-martin-libs';
import { firstValueFrom } from 'rxjs';
import { Transaction } from 'sequelize';

import { StoresCreateDto } from './dto/request/stores.create.dto';
import { StoresUpdateDto } from './dto/request/stores.update.dto';
import { StoresService } from './stores.service';

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  firstValueFrom: jest.fn(),
}));

const checkStockResult = (store: StoresEntity, storeBody: StoresCreateDto) => {
  expect(store).toBeDefined();
  expect(store.name).toEqual(storeBody.name);
  expect(store.status).toEqual(storeBody.status);
  expect(store.countryId).toEqual(storeBody.countryId);
  expect(store.servicePhone).toEqual(storeBody.servicePhone);
  expect(store.standardDeliveryTime).toEqual(storeBody.standardDeliveryTime);
  expect(store.maxOrderLag).toEqual(storeBody.maxOrderLag);
  expect(store.address).toEqual(storeBody.address || store.address);
  expect(store.positionLat).toEqual(storeBody.positionLat || store.positionLat);
  expect(store.positionLng).toEqual(storeBody.positionLng || store.positionLng);

  if (store.storesTimeWork) {
    expect(store.storesTimeWork.monday).toEqual(storeBody.storeTimeWork.monday);
    expect(store.storesTimeWork.mondayOpen).toEqual(
      storeBody.storeTimeWork.mondayOpen ? storeBody.storeTimeWork.mondayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.mondayClose).toEqual(
      storeBody.storeTimeWork.mondayClose ? storeBody.storeTimeWork.mondayClose + ':00' : null,
    );
    expect(store.storesTimeWork.tuesday).toEqual(storeBody.storeTimeWork.tuesday);
    expect(store.storesTimeWork.tuesdayOpen).toEqual(
      storeBody.storeTimeWork.tuesdayOpen ? storeBody.storeTimeWork.tuesdayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.tuesdayClose).toEqual(
      storeBody.storeTimeWork.tuesdayClose ? storeBody.storeTimeWork.tuesdayClose + ':00' : null,
    );
    expect(store.storesTimeWork.wednesday).toEqual(storeBody.storeTimeWork.wednesday);
    expect(store.storesTimeWork.wednesdayOpen).toEqual(
      storeBody.storeTimeWork.wednesdayOpen ? storeBody.storeTimeWork.wednesdayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.wednesdayClose).toEqual(
      storeBody.storeTimeWork.wednesdayClose
        ? storeBody.storeTimeWork.wednesdayClose + ':00'
        : null,
    );
    expect(store.storesTimeWork.thursday).toEqual(storeBody.storeTimeWork.thursday);
    expect(store.storesTimeWork.thursdayOpen).toEqual(
      storeBody.storeTimeWork.thursdayOpen ? storeBody.storeTimeWork.thursdayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.thursdayClose).toEqual(
      storeBody.storeTimeWork.thursdayClose ? storeBody.storeTimeWork.thursdayClose + ':00' : null,
    );
    expect(store.storesTimeWork.friday).toEqual(storeBody.storeTimeWork.friday);
    expect(store.storesTimeWork.fridayOpen).toEqual(
      storeBody.storeTimeWork.fridayOpen ? storeBody.storeTimeWork.fridayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.fridayClose).toEqual(
      storeBody.storeTimeWork.fridayClose ? storeBody.storeTimeWork.fridayClose + ':00' : null,
    );
    expect(store.storesTimeWork.saturday).toEqual(storeBody.storeTimeWork.saturday);
    expect(store.storesTimeWork.saturdayOpen).toEqual(
      storeBody.storeTimeWork.saturdayOpen ? storeBody.storeTimeWork.saturdayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.saturdayClose).toEqual(
      storeBody.storeTimeWork.saturdayClose ? storeBody.storeTimeWork.saturdayClose + ':00' : null,
    );
    expect(store.storesTimeWork.sunday).toEqual(storeBody.storeTimeWork.sunday);
    expect(store.storesTimeWork.sundayOpen).toEqual(
      storeBody.storeTimeWork.sundayOpen ? storeBody.storeTimeWork.sundayOpen + ':00' : null,
    );
    expect(store.storesTimeWork.sundayClose).toEqual(
      storeBody.storeTimeWork.sundayClose ? storeBody.storeTimeWork.sundayClose + ':00' : null,
    );
  }

  if (store.storeOrderPerHours) {
    expect(store.storeOrderPerHours).toBeDefined();
    store.storeOrderPerHours.forEach((orderPerHour, index) => {
      expect(orderPerHour.weekName).toEqual(storeBody.storeOrderPerHours[index].weekName);
      orderPerHour.listOrderPerHours.forEach((list, indexList) => {
        expect(list.timePeriod).toEqual(
          storeBody.storeOrderPerHours[index].listOrderPerHours[indexList].timePeriod,
        );
        expect(list.maxOrderAmount).toEqual(
          storeBody.storeOrderPerHours[index].listOrderPerHours[indexList].maxOrderAmount,
        );
      });
    });
  }
};

describe('StoresService', () => {
  let service: StoresService;
  let transaction: Transaction;
  let countryId: number = 1;
  let storeId: number = 1;

  const mockStoreOrderPerHours = [
    {
      weekName: WeekName.MONDAY,
      listOrderPerHours: [
        { timePeriod: '06:00-06:30', maxOrderAmount: 30 },
        { timePeriod: '06:30-07:00', maxOrderAmount: 30 },
      ],
    },
    {
      weekName: WeekName.TUESDAY,
      listOrderPerHours: [
        { timePeriod: '06:00-06:30', maxOrderAmount: 30 },
        { timePeriod: '06:30-07:00', maxOrderAmount: 30 },
      ],
    },
  ];

  const mockStore = {
    ...mockStoreData,
    storeTimeWork: mockTimeWorkData,
    storeOrderPerHours: mockStoreOrderPerHours,
  };

  const mockUpdateStoreTimeWork = {
    monday: true,
    mondayOpen: '09:00',
    mondayClose: '20:00',
    tuesday: true,
    tuesdayOpen: '07:00',
    tuesdayClose: '19:00',
    wednesday: true,
    wednesdayOpen: '07:00',
    wednesdayClose: '19:00',
    thursday: true,
    thursdayOpen: '09:00',
    thursdayClose: '20:00',
    friday: false,
    fridayOpen: null,
    fridayClose: null,
    saturday: true,
    saturdayOpen: '07:00',
    saturdayClose: '19:00',
    sunday: true,
    sundayOpen: '07:00',
    sundayClose: '19:00',
  };

  const mokUpdateStoreDto: StoresUpdateDto = {
    name: 'Stores 2',
    status: EntityStatus.INACTIVE,
    servicePhone: '+5025567567',
    standardDeliveryTime: 30,
    maxOrderLag: 30,
  };

  const mockStoresProvider = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
  };
  const mockStoresTimeWorkProvider = { create: jest.fn() };
  const mockStoreDeliveryZonesProvider = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };
  const mockStoresOrderPerHoursProvider = { bulkCreate: jest.fn(), destroy: jest.fn() };

  const mockStoreDbData = {
    ...mockStoreData,
    id: 1,
    countryId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStoreTimeWorkDbData = {
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
    id: 1,
    storeId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockHttpService = { get: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [
        StoresService,
        AppConfigService,
        { provide: EntityProviders.STORES_PROVIDER, useValue: mockStoresProvider },
        {
          provide: EntityProviders.STORES_TIME_WORK_PROVIDER,
          useValue: mockStoresTimeWorkProvider,
        },
        {
          provide: EntityProviders.STORE_DELIVERY_ZONES_PROVIDER,
          useValue: mockStoreDeliveryZonesProvider,
        },
        {
          provide: EntityProviders.STORES_ORDER_PER_HOURS_PROVIDER,
          useValue: mockStoresOrderPerHoursProvider,
        },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Stores CRUD', () => {
    it('should be created', async () => {
      mockStoresProvider.count.mockResolvedValue(0);
      mockStoresProvider.create.mockResolvedValue(mockStoreDbData);
      mockStoresProvider.findByPk.mockResolvedValue({
        ...mockStoreDbData,
        storesTimeWork: mockStoreTimeWorkDbData,
      });
      mockStoresTimeWorkProvider.create.mockResolvedValue(mockStoreTimeWorkDbData);
      mockHttpService.get.mockResolvedValue({ status: HttpStatus.OK });
      (firstValueFrom as jest.Mock).mockResolvedValue({ status: HttpStatus.OK });

      const storeBody: StoresCreateDto = {
        ...mockStore,
        countryId,
      };
      const store = await service.create(transaction, storeBody);

      checkStockResult(store, storeBody);
    });

    it('should be get error STORE_EXISTS', async () => {
      mockStoresProvider.count.mockResolvedValue(1);
      const stockBody: StoresCreateDto = {
        ...mockStore,
        countryId,
      };

      try {
        await service.create(transaction, stockBody);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.STORE_EXISTS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be get store by id', async () => {
      mockStoresProvider.findByPk.mockResolvedValue({
        ...mockStoreDbData,
        storesTimeWork: mockStoreTimeWorkDbData,
      });
      const store = await service.getById(storeId);

      checkStockResult(store, { ...mockStore, countryId } as StoresCreateDto);
    });

    it('should be get error STORE_NOT_FOUND when user try get store by id', async () => {
      mockStoresProvider.findByPk.mockResolvedValue(null);
      try {
        await service.getById(2);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.STORE_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should be get stores list', async () => {
      mockStoresProvider.findAndCountAll.mockResolvedValue({
        rows: [
          {
            dataValues: {
              ...mockStoreDbData,
            },
          },
        ],
        count: 1,
      });
      const stores = await service.getStoresList({ limit: 10, offset: 0, countryId });

      expect(stores).toBeDefined();
      stores.result.forEach((store) => {
        expect(store.name).toEqual(mockStore.name);
        expect(store.status).toEqual(mockStore.status);
        expect(store.countryId).toEqual(countryId);
      });
      expect(stores.count).toEqual(1);
    });

    it('should be get stores list and filter list by name', async () => {
      mockStoresProvider.findAndCountAll.mockResolvedValue({
        rows: [
          {
            dataValues: {
              ...mockStoreDbData,
            },
          },
        ],
        count: 1,
      });
      const stores = await service.getStoresList({
        limit: 10,
        offset: 0,
        countryId,
        search: mockStore.name,
      });

      expect(stores).toBeDefined();
      stores.result.forEach((store) => {
        expect(store.name).toEqual(mockStore.name);
        expect(store.status).toEqual(mockStore.status);
        expect(store.countryId).toEqual(countryId);
      });
      expect(stores.count).toEqual(1);
    });

    it('should be get stores list and filter list by status', async () => {
      mockStoresProvider.findAndCountAll.mockResolvedValue({
        rows: [
          {
            dataValues: {
              ...mockStoreDbData,
            },
          },
        ],
        count: 1,
      });
      const stores = await service.getStoresList({
        limit: 10,
        offset: 0,
        countryId,
        status: EntityStatus.ACTIVE,
      });

      expect(stores).toBeDefined();
      stores.result.forEach((store) => {
        expect(store.name).toEqual(mockStore.name);
        expect(store.status).toEqual(mockStore.status);
        expect(store.countryId).toEqual(countryId);
      });
      expect(stores.count).toEqual(1);
    });

    it('should be get stores list and filter list by status but get empty data', async () => {
      mockStoresProvider.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });
      const stores = await service.getStoresList({
        limit: 10,
        offset: 0,
        countryId,
        status: EntityStatus.INACTIVE,
      });

      expect(stores).toBeDefined();
      expect(stores.result).toHaveLength(0);
      expect(stores.count).toEqual(0);
    });

    it('should be get stores list and filter list by name but get empty data', async () => {
      mockStoresProvider.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });
      const stores = await service.getStoresList({
        limit: 10,
        offset: 0,
        countryId,
        search: 'Store empty',
      });

      expect(stores).toBeDefined();
      expect(stores.result).toHaveLength(0);
      expect(stores.count).toEqual(0);
    });

    it('should be update store', async () => {
      mockStoresProvider.findByPk.mockResolvedValue({
        ...mockStoreDbData,
        storesTimeWork: { ...mockStoreTimeWorkDbData, update: jest.fn() },
        update: jest.fn(),
      });
      expect(await service.update(transaction, storeId, mokUpdateStoreDto)).toBe(void 0);
    });

    it('should be update store time work', async () => {
      mockStoresProvider.findByPk.mockResolvedValue({
        ...mockStoreDbData,
        storesTimeWork: { ...mockStoreTimeWorkDbData, update: jest.fn() },
        update: jest.fn(),
      });
      expect(await service.updateStoreTimeWork(transaction, storeId, mockUpdateStoreTimeWork)).toBe(
        void 0,
      );
    });

    it('should be get update data store by id', async () => {
      mockStoresProvider.findByPk.mockResolvedValue({
        ...mockStoreDbData,
        ...mokUpdateStoreDto,
        storeTimeWork: mockStoreTimeWorkDbData,
        update: jest.fn(),
      });
      const store = await service.getById(storeId);

      checkStockResult(store, {
        ...mokUpdateStoreDto,
        countryId,
        storeTimeWork: mockUpdateStoreTimeWork,
        storeOrderPerHours: mockStoreOrderPerHours,
      } as StoresCreateDto);
    });

    it('should be get stores list and filter list by name after update', async () => {
      mockStoresProvider.findAndCountAll.mockResolvedValue({
        rows: [{ dataValues: { ...mockStoreDbData, ...mokUpdateStoreDto } }],
        count: 1,
      });
      const stores = await service.getStoresList({
        limit: 10,
        offset: 0,
        countryId,
        search: mokUpdateStoreDto.name,
      });

      expect(stores).toBeDefined();
      stores.result.forEach((store) => {
        expect(store.name).toEqual(mokUpdateStoreDto.name);
        expect(store.status).toEqual(mokUpdateStoreDto.status);
        expect(store.countryId).toEqual(countryId);
      });
      expect(stores.count).toEqual(1);
    });

    it('should be deleted store', async () => {
      mockStoresProvider.findByPk.mockResolvedValue({
        ...mockStoreDbData,
        ...mokUpdateStoreDto,
        storeTimeWork: mockStoreTimeWorkDbData,
        destroy: jest.fn(),
      });
      expect(await service.delete(transaction, storeId)).toBe(void 0);
    });

    it('should be get error STORE_NOT_FOUND after delete store', async () => {
      mockStoresProvider.findByPk.mockResolvedValue(null);
      try {
        await service.getById(storeId);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.STORE_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
