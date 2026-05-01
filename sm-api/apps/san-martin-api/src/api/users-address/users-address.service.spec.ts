import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EntityProviders,
  ErrorMessageEnum,
  mockUserAddress,
  OperationError,
  UserAddressType,
  UsersAddressEntity,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { UsersMeAddressCreateDto } from './dto/request/users-me-address.create.dto';
import { UsersMeAddressUpdateDto } from './dto/request/users-me-address.update.dto';
import { UsersAddressService } from './users-address.service';

const checkUserAddress = (
  userAddress: UsersAddressEntity,
  userAddressData: UsersMeAddressCreateDto,
  userId: number,
) => {
  expect(userAddress).toBeDefined();
  expect(userAddress.userId).toEqual(userId);
  expect(userAddress.type).toEqual(userAddressData.type);
  expect(userAddress.country).toEqual(userAddressData.country);
  expect(userAddress.city).toEqual(userAddressData.city);
  expect(userAddress.state).toEqual(userAddressData.state);
  expect(userAddress.subLocality).toEqual(userAddressData.subLocality);
  expect(userAddress.address).toEqual(userAddressData.address);
  expect(userAddress.positionLat).toEqual(userAddressData.positionLat);
  expect(userAddress.positionLng).toEqual(userAddressData.positionLng);
  expect(userAddress.addressDetails).toEqual(userAddressData.addressDetails);
  expect(userAddress.floorNumber).toEqual(userAddressData.floorNumber);
  expect(userAddress.doorNumber).toEqual(userAddressData.doorNumber);
  expect(userAddress.isDefault).toEqual(userAddressData.isDefault || false);
};

describe('UsersAddressService', () => {
  let service: UsersAddressService;
  let transaction: Transaction;
  let userId: number = 1;
  let userAddressId: number = 1;

  const mockAddress = { ...mockUserAddress };

  const mockUserAddressProvide = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
  };

  const mockAddressData = { ...mockAddress, id: 1, createdAt: Date.now(), updatedAt: Date.now() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersAddressService,
        { provide: EntityProviders.USERS_ADDRESS_PROVIDER, useValue: mockUserAddressProvide },
      ],
    }).compile();

    service = module.get<UsersAddressService>(UsersAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User me address CRUD tests', () => {
    it('should be create user me address home type', async () => {
      mockUserAddressProvide.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockUserAddressProvide.create.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.HOME,
        isDefault: true,
        userId,
      });
      const userAddressBody = {
        ...mockAddress,
        type: UserAddressType.HOME,
        isDefault: true,
        userId,
      };
      const userAddress = await service.createUserMeAddress(
        transaction,
        userId,
        userAddressBody as unknown as UsersMeAddressCreateDto,
      );

      checkUserAddress(userAddress, userAddressBody as unknown as UsersMeAddressCreateDto, userId);
    });

    it('should be get error user_address_exist when create user me address', async () => {
      try {
        mockUserAddressProvide.count.mockResolvedValueOnce(1);
        const userAddressBody = { ...mockAddress, type: UserAddressType.HOME };
        await service.createUserMeAddress(
          transaction,
          userId,
          userAddressBody as unknown as UsersMeAddressCreateDto,
        );
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USERS_ADDRESS_EXIST);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be get error this_user_have_home_address when create user me address', async () => {
      try {
        mockUserAddressProvide.count.mockResolvedValueOnce(0).mockResolvedValueOnce(1);
        const userAddressBody = {
          ...mockAddress,
          address: '9A Calle 1, 12',
          type: UserAddressType.HOME,
        };
        await service.createUserMeAddress(
          transaction,
          userId,
          userAddressBody as unknown as UsersMeAddressCreateDto,
        );
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.THIS_USER_HAVE_HOME_ADDRESS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be create user me address office type', async () => {
      mockUserAddressProvide.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockUserAddressProvide.create.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.OFFICE,
        isDefault: false,
        userId,
        id: 2,
      });
      const userAddressBody = {
        ...mockAddress,
        type: UserAddressType.OFFICE,
      };
      const userAddress = await service.createUserMeAddress(
        transaction,
        userId,
        userAddressBody as unknown as UsersMeAddressCreateDto,
      );

      checkUserAddress(userAddress, userAddressBody as unknown as UsersMeAddressCreateDto, userId);
    });

    it('should be get error this_user_have_office_address when create user me address', async () => {
      mockUserAddressProvide.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1);
      try {
        const userAddressBody = {
          ...mockAddress,
          type: UserAddressType.OFFICE,
        };
        await service.createUserMeAddress(
          transaction,
          userId,
          userAddressBody as unknown as UsersMeAddressCreateDto,
        );
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.THIS_USER_HAVE_OFFICE_ADDRESS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be create user me address other type', async () => {
      mockUserAddressProvide.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockUserAddressProvide.create.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.OTHER,
        isDefault: false,
        userId,
        id: 3,
      });
      const userAddressBody = {
        ...mockAddress,
        type: UserAddressType.OTHER,
      };
      const userAddress = await service.createUserMeAddress(
        transaction,
        userId,
        userAddressBody as unknown as UsersMeAddressCreateDto,
      );
      checkUserAddress(userAddress, userAddressBody as unknown as UsersMeAddressCreateDto, userId);
    });

    it('should be get user me address lists', async () => {
      mockUserAddressProvide.findAll.mockResolvedValue([
        {
          type: UserAddressType.HOME,
          dataValues: {
            ...mockAddressData,
            type: UserAddressType.HOME,
            isDefault: true,
            userId,
          },
        },
        {
          type: UserAddressType.OFFICE,
          dataValues: {
            ...mockAddressData,
            type: UserAddressType.OFFICE,
            isDefault: false,
            userId,
          },
        },
        {
          type: UserAddressType.OTHER,
          dataValues: {
            ...mockAddressData,
            type: UserAddressType.OTHER,
            isDefault: false,
            userId,
          },
        },
      ]);
      const userAddressLists = await service.getUserMeAddressLists(userId, {
        isCustomerCart: false,
      });

      expect(userAddressLists).toBeDefined();
      expect(userAddressLists.home).toBeDefined();
      expect(userAddressLists.office).toBeDefined();
      expect(userAddressLists.other).not.toHaveLength(0);
    });

    it('should be get user me address by id', async () => {
      mockUserAddressProvide.findOne.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.OTHER,
        isDefault: false,
        userId,
        id: 3,
      });
      const userAddressBody = {
        ...mockAddress,
        type: UserAddressType.OTHER,
      };
      const userAddress = await service.getUserMeAddress(userId, userAddressId);

      checkUserAddress(userAddress, userAddressBody as unknown as UsersMeAddressCreateDto, userId);
    });

    it('should be update user me address by id', async () => {
      mockUserAddressProvide.findOne.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.OTHER,
        isDefault: false,
        userId,
        id: 3,
        update: jest.fn(),
      });
      const userAddressUpdateBody = {
        ...mockAddress,
        address: '9A Calle 5, 12',
        subLocality: 'Zone 9',
        positionLat: 55.8934435,
        positionLng: 33.4623453,
        addressDetails: 'Test 2',
        type: UserAddressType.OTHER,
      };
      expect(
        await service.updateUserMeAddress(
          transaction,
          userId,
          userAddressId,
          userAddressUpdateBody as UsersMeAddressUpdateDto,
        ),
      ).toBe(void 0);
    });

    it('should be get error this_user_have_home_address when update user me address', async () => {
      mockUserAddressProvide.count.mockResolvedValueOnce(1);
      try {
        const userAddressUpdateBody = {
          ...mockAddress,
          address: '9A Calle 5, 12',
          subLocality: 'Zone 9',
          positionLat: 55.8934435,
          positionLng: 33.4623453,
          addressDetails: 'Test 2',
          type: UserAddressType.HOME,
        };
        expect(
          await service.updateUserMeAddress(
            transaction,
            userId,
            userAddressId,
            userAddressUpdateBody as UsersMeAddressUpdateDto,
          ),
        ).toBe(void 0);
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.THIS_USER_HAVE_HOME_ADDRESS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be get error this_user_have_office_address when update user me address', async () => {
      mockUserAddressProvide.count.mockResolvedValueOnce(0).mockResolvedValueOnce(1);
      try {
        const userAddressUpdateBody = {
          ...mockAddress,
          address: '9A Calle 5, 12',
          subLocality: 'Zone 9',
          positionLat: 55.8934435,
          positionLng: 33.4623453,
          addressDetails: 'Test 2',
          type: UserAddressType.OFFICE,
        };
        expect(
          await service.updateUserMeAddress(
            transaction,
            userId,
            userAddressId,
            userAddressUpdateBody as UsersMeAddressUpdateDto,
          ),
        ).toBe(void 0);
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.THIS_USER_HAVE_OFFICE_ADDRESS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be get user me address by id after update', async () => {
      mockUserAddressProvide.findOne.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.OTHER,
        isDefault: false,
        userId,
        id: 3,
        update: jest.fn(),
        address: '9A Calle 5, 12',
        subLocality: 'Zone 9',
        positionLat: 55.8934435,
        positionLng: 33.4623453,
        addressDetails: 'Test 2',
      });
      const userAddressUpdateBody = {
        ...mockAddress,
        address: '9A Calle 5, 12',
        subLocality: 'Zone 9',
        positionLat: 55.8934435,
        positionLng: 33.4623453,
        addressDetails: 'Test 2',
        type: UserAddressType.OTHER,
      };

      const userAddress = await service.getUserMeAddress(userId, userAddressId);

      checkUserAddress(userAddress, userAddressUpdateBody, userId);
    });

    it('should be delete user me address by id', async () => {
      mockUserAddressProvide.findOne.mockResolvedValue({
        ...mockAddressData,
        type: UserAddressType.OTHER,
        isDefault: false,
        userId,
        id: 3,
        update: jest.fn(),
        address: '9A Calle 5, 12',
        subLocality: 'Zone 9',
        positionLat: 55.8934435,
        positionLng: 33.4623453,
        addressDetails: 'Test 2',
        destroy: jest.fn(),
      });
      expect(await service.deleteUserMeAddress(transaction, userId, userAddressId)).toBe(void 0);
    });

    it('should be get error user_address_not_found when create user me address', async () => {
      mockUserAddressProvide.findOne.mockResolvedValue(null);
      try {
        await service.getUserMeAddress(userId, userAddressId);
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_ADDRESS_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
