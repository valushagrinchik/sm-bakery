import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigModule,
  AppConfigService,
  AwsService,
  BullQueueService,
  EntityProviders,
  ErrorMessageEnum,
  hashString,
  MicroserviceChanelName,
  mockArrayRole,
  mockUserData,
  OperationError,
  Platform,
  RabbitMqModule,
  RedisService,
  RoleId,
  UsersEntity,
  UserStatus,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { UsersAdminCreateDto, UsersAdminUpdateDto } from './dto';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { UsersMeUpdateDto } from './dto/request/users-me-update.dto';

const checkUser = (
  user: UsersEntity,
  userData: UsersAdminCreateDto | UsersMeUpdateDto,
  verified?: boolean,
  phoneVerified?: boolean,
) => {
  expect(user).toBeDefined();
  expect(user.firstName).toEqual(userData.firstName);
  expect(user.lastName).toEqual(userData.lastName);
  expect(user.email).toEqual(userData.email);
  expect(user.phone).toEqual(userData.phone);
  expect(user.countryId).toEqual(userData.countryId);

  if (verified !== undefined) {
    expect(user.verified).toEqual(verified);
  }

  if (phoneVerified !== undefined) {
    expect(user.phoneVerified).toEqual(phoneVerified);
  }

  if (!(userData instanceof UsersMeUpdateDto)) {
    expect(user.roleId).toEqual(userData.roleId);
  }

  if (user.roleId === RoleId.Customer) {
    expect(user.operator).toBe(null);
    expect(user.customer).toBeDefined();
    expect(user.customer.userId).toEqual(user.id);
    if (!(userData instanceof UsersAdminCreateDto)) {
      expect(user.customer.birthday).toEqual(user.customer.birthday ? userData.birthday : null);
    }
  }

  const operatorsRole = [RoleId.StoreManager, RoleId.CountryManager];

  if (operatorsRole.includes(user.roleId)) {
    expect(user.customer).toBe(null);
    expect(user.operator).toBeDefined();
    expect(user.operator.userId).toEqual(user.id);
    if (!(userData instanceof UsersMeUpdateDto)) {
      expect(user.operator.countryId).toEqual(
        user.roleId === RoleId.CountryManager ? userData.countryId : null,
      );
    }

    if (!(userData instanceof UsersMeUpdateDto)) {
      expect(user.operator.storeId).toEqual(
        user.roleId !== RoleId.CountryManager ? userData.storeId : null,
      );
    }
  }
};

describe('UsersService', () => {
  let service: UsersService;
  let transaction: Transaction;
  let countryId: number = 1;
  let storeId: number = 1;
  let userId: number = 1;
  let userMeId: number = 5;

  const updateUserData: UsersAdminUpdateDto = {
    firstName: 'Super',
    lastName: 'Customer',
    email: 'customer+1@test.com',
    phone: '+5024334455',
    roleId: RoleId.Customer,
    status: UserStatus.BLOCKED,
  };

  const mockRedis = {
    setResetPasswordCode: jest.fn(),
    getSmsCode: jest.fn(),
    getResetPasswordCode: jest.fn(),
    delSmsCode: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    setSmsCode: jest.fn(),
  };

  const mockBullQueue = {
    createBullQueue: jest.fn(),
  };

  const mockAwsService = {
    copyImage: jest.fn(),
    deleteImage: jest.fn(),
    uploadUserImage: jest.fn(),
  };

  const mockUserProvider = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
  };
  const mockCustomerProvider = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };
  const mockOperatorsProvider = { create: jest.fn() };
  const mockRolesService = { findById: jest.fn() };
  const mockUsersAddressProvider = { destroy: jest.fn() };
  const mockStoreDeliveryZonesProvider = { findAll: jest.fn() };
  const mockVersionsProvider = { findByPk: jest.fn() };

  const mockSuperAdminUser = {
    ...mockUserData,
    roleId: RoleId.SuperAdmin,
    countryId: countryId,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCountryManagerUser = {
    ...mockUserData,
    email: 'country.manager@test.com',
    roleId: RoleId.CountryManager,
    phone: '+5021111112',
    countryId: countryId,
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStoreManagerUser = {
    ...mockUserData,
    email: 'store.manager@test.com',
    roleId: RoleId.StoreManager,
    countryId,
    storeId,
    phone: '+5021111115',
    id: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDeliveryManUser = {
    ...mockUserData,
    email: 'delivery.man@test.com',
    roleId: RoleId.DeliveryMan,
    countryId,
    phone: '+5021111113',
    id: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCustomerUser = {
    ...mockUserData,
    email: 'customer@test.com',
    roleId: RoleId.Customer,
    countryId,
    phone: '+5021111114',
    id: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RabbitMqModule.register({ name: MicroserviceChanelName.EMAIL_SERVICE }),
        RabbitMqModule.register({ name: MicroserviceChanelName.SMS_SERVICE }),
        RolesModule,
        AppConfigModule,
      ],
      providers: [
        UsersService,
        AppConfigService,
        { provide: RolesService, useValue: mockRolesService },
        { provide: RedisService, useValue: mockRedis },
        { provide: AwsService, useValue: mockAwsService },
        { provide: BullQueueService, useValue: mockBullQueue },
        { provide: EntityProviders.USERS_PROVIDER, useValue: mockUserProvider },
        { provide: EntityProviders.CUSTOMERS_PROVIDER, useValue: mockCustomerProvider },
        { provide: EntityProviders.OPERATORS_PROVIDER, useValue: mockOperatorsProvider },
        { provide: EntityProviders.USERS_ADDRESS_PROVIDER, useValue: mockUsersAddressProvider },
        {
          provide: EntityProviders.STORE_DELIVERY_ZONES_PROVIDER,
          useValue: mockStoreDeliveryZonesProvider,
        },
        { provide: EntityProviders.VERSIONS_PROVIDER, useValue: mockVersionsProvider },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Users CRUD test', () => {
    it('should be create super admin user', async () => {
      mockUserProvider.count.mockResolvedValue(0);
      mockUserProvider.create.mockResolvedValue(mockSuperAdminUser);
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      mockRolesService.findById.mockResolvedValue({ ...mockArrayRole[0], id: RoleId.SuperAdmin });

      const userData = { ...mockUserData, roleId: RoleId.SuperAdmin, countryId };

      const user = await service.create(transaction, userData);

      userId = user.id;

      checkUser(user, userData);
    });

    it('should be create country manager user', async () => {
      const operators = {
        userId: mockCountryManagerUser.id,
        countryId: mockCountryManagerUser.roleId === RoleId.CountryManager ? countryId : null,
        storeId: mockCountryManagerUser.roleId === RoleId.StoreManager ? storeId : null,
        deliveryZoneId: mockCountryManagerUser.roleId === RoleId.DeliveryMan ? 1 : null,
      };
      mockUserProvider.count.mockResolvedValue(0);
      mockUserProvider.create.mockResolvedValue(mockCountryManagerUser);
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCountryManagerUser,
        operator: operators,
        customer: null,
      });
      mockRolesService.findById.mockResolvedValue({
        ...mockArrayRole[1],
        id: RoleId.CountryManager,
      });
      mockOperatorsProvider.create.mockResolvedValue(operators);

      const userData = {
        ...mockUserData,
        email: 'country.manager@test.com',
        roleId: RoleId.CountryManager,
        countryId,
        phone: '+5021111112',
      };

      const user = await service.create(transaction, userData);

      checkUser(user, userData);
    });

    it('should be create store manager user', async () => {
      const operators = {
        userId: mockStoreManagerUser.id,
        countryId: mockStoreManagerUser.roleId === RoleId.CountryManager ? countryId : null,
        storeId: mockStoreManagerUser.roleId === RoleId.StoreManager ? storeId : null,
        deliveryZoneId: mockStoreManagerUser.roleId === RoleId.DeliveryMan ? 1 : null,
      };
      mockUserProvider.count.mockResolvedValue(0);
      mockUserProvider.create.mockResolvedValue(mockStoreManagerUser);
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockStoreManagerUser,
        operator: operators,
        customer: null,
      });
      mockRolesService.findById.mockResolvedValue({
        ...mockArrayRole[2],
        id: RoleId.StoreManager,
      });
      mockOperatorsProvider.create.mockResolvedValue(operators);

      const userData = {
        ...mockUserData,
        email: 'store.manager@test.com',
        roleId: RoleId.StoreManager,
        countryId,
        storeId,
        phone: '+5021111115',
      };

      const user = await service.create(transaction, userData);

      checkUser(user, userData);
    });

    it('should be create delivery man user', async () => {
      const operators = {
        userId: mockStoreManagerUser.id,
        countryId: mockStoreManagerUser.roleId === RoleId.CountryManager ? countryId : null,
        storeId: mockStoreManagerUser.roleId === RoleId.StoreManager ? storeId : null,
        deliveryZoneId: mockStoreManagerUser.roleId === RoleId.DeliveryMan ? 1 : null,
      };

      mockUserProvider.count.mockResolvedValue(0);
      mockUserProvider.create.mockResolvedValue(mockDeliveryManUser);
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockDeliveryManUser,
        operator: operators,
        customer: null,
      });
      mockRolesService.findById.mockResolvedValue({
        ...mockArrayRole[3],
        id: RoleId.DeliveryMan,
      });
      mockOperatorsProvider.create.mockResolvedValue(operators);

      const userData = {
        ...mockUserData,
        email: 'delivery.man@test.com',
        roleId: RoleId.DeliveryMan,
        countryId,
        storeId,
        phone: '+5021111113',
      };

      const user = await service.create(transaction, userData);

      checkUser(user, userData);
    });

    it('should be create customer user', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };

      mockUserProvider.count.mockResolvedValue(0);
      mockUserProvider.create.mockResolvedValue(mockCustomerUser);
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer: customer,
      });
      mockRolesService.findById.mockResolvedValue({
        ...mockArrayRole[4],
        id: RoleId.Customer,
      });

      const userData = {
        ...mockUserData,
        email: 'customer@test.com',
        roleId: RoleId.Customer,
        countryId,
        phone: '+5021111114',
      };

      const user = await service.create(transaction, userData);

      checkUser(user, userData);
    });

    it('should be get error USER_WITH_THIS_EMAIL_EXISTS when create user', async () => {
      try {
        mockUserProvider.count.mockResolvedValue(1);
        const userData = { ...mockUserData, roleId: RoleId.SuperAdmin, countryId };

        await service.create(transaction, userData);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be get user by id', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      const userData = { ...mockUserData, roleId: RoleId.SuperAdmin, countryId };
      const user = await service.getById(userId);

      checkUser(user, userData);
    });

    it('should be get error USER_NOT_FOUND when get user by id', async () => {
      try {
        mockUserProvider.findByPk.mockResolvedValue(null);
        await service.getById(99);
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
    //
    it('should be update user by id', async () => {
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockSuperAdminUser,
        update: jest.fn().mockResolvedValue({
          ...mockSuperAdminUser,
          firstName: updateUserData.firstName,
          lastName: updateUserData.lastName,
          email: updateUserData.email,
          phone: updateUserData.phone,
          roleId: updateUserData.roleId,
          status: updateUserData.status,
          operator: null,
          customer: { id: 2, userId: 1 },
        }),
      });
      mockUserProvider.count.mockResolvedValue(0);
      expect(await service.update(transaction, userId, updateUserData)).toBe(void 0);
    });

    it('should be get user by id after update', async () => {
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockSuperAdminUser,
        firstName: updateUserData.firstName,
        lastName: updateUserData.lastName,
        email: updateUserData.email,
        phone: updateUserData.phone,
        roleId: updateUserData.roleId,
        status: updateUserData.status,
        operator: null,
        customer: { id: 2, userId: 1, birthday: null },
      });

      const user = await service.getById(userId);

      checkUser(user, { ...updateUserData, countryId });
    });

    it('should be get users list', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      mockUserProvider.findAll.mockResolvedValue([
        mockSuperAdminUser,
        mockCountryManagerUser,
        mockStoreManagerUser,
        mockDeliveryManUser,
        mockCustomerUser,
      ]);

      mockUserProvider.count.mockResolvedValue(5);

      const user = await service.getById(userId);

      const users = await service.getUsersList(
        { countryId: countryId, limit: 10, offset: 0 },
        user,
      );

      expect(users.result).not.toHaveLength(0);
      expect(users.count).toEqual(5);
    });

    it('should be filter users list by firstName and lastName', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      mockUserProvider.findAll.mockResolvedValue([
        {
          dataValues: {
            ...mockSuperAdminUser,
            firstName: updateUserData.firstName,
            lastName: updateUserData.lastName,
            email: updateUserData.email,
            phone: updateUserData.phone,
            roleId: updateUserData.roleId,
            status: updateUserData.status,
          },
        },
      ]);
      mockUserProvider.count.mockResolvedValue(1);

      const user = await service.getById(userId);
      const users = await service.getUsersList(
        {
          countryId: countryId,
          limit: 10,
          offset: 0,
          search: `${updateUserData.firstName} ${updateUserData.lastName}`,
        },
        user,
      );

      expect(users.result).not.toHaveLength(0);
      users.result.forEach((user) => {
        expect(user.firstName).toEqual(updateUserData.firstName);
        expect(user.lastName).toEqual(updateUserData.lastName);
      });
      expect(users.count).toEqual(1);
    });

    it('should be filter users list by email', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      mockUserProvider.findAll.mockResolvedValue([
        {
          dataValues: {
            ...mockSuperAdminUser,
            firstName: updateUserData.firstName,
            lastName: updateUserData.lastName,
            email: updateUserData.email,
            phone: updateUserData.phone,
            roleId: updateUserData.roleId,
            status: updateUserData.status,
          },
        },
      ]);
      mockUserProvider.count.mockResolvedValue(1);
      const user = await service.getById(userId);
      const users = await service.getUsersList(
        {
          countryId: countryId,
          limit: 10,
          offset: 0,
          search: updateUserData.email,
        },
        user,
      );

      expect(users.result).not.toHaveLength(0);
      users.result.forEach((user) => {
        expect(user.email).toEqual(updateUserData.email);
      });
      expect(users.count).toEqual(1);
    });

    it('should be filter users list by phone', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      mockUserProvider.findAll.mockResolvedValue([
        {
          dataValues: {
            ...mockSuperAdminUser,
            firstName: updateUserData.firstName,
            lastName: updateUserData.lastName,
            email: updateUserData.email,
            phone: updateUserData.phone,
            roleId: updateUserData.roleId,
            status: updateUserData.status,
          },
        },
      ]);
      mockUserProvider.count.mockResolvedValue(1);

      const user = await service.getById(userId);
      const users = await service.getUsersList(
        {
          countryId: countryId,
          limit: 10,
          offset: 0,
          search: updateUserData.phone,
        },
        user,
      );

      expect(users.result).not.toHaveLength(0);
      users.result.forEach((user) => {
        expect(user.phone).toEqual(updateUserData.phone);
      });
      expect(users.count).toEqual(1);
    });

    it('should be filter users list by status', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockSuperAdminUser);
      mockUserProvider.findAll.mockResolvedValue([
        {
          dataValues: {
            ...mockSuperAdminUser,
            firstName: updateUserData.firstName,
            lastName: updateUserData.lastName,
            email: updateUserData.email,
            phone: updateUserData.phone,
            roleId: updateUserData.roleId,
            status: updateUserData.status,
          },
        },
      ]);
      mockUserProvider.count.mockResolvedValue(1);

      const user = await service.getById(userId);
      const users = await service.getUsersList(
        {
          countryId: countryId,
          limit: 10,
          offset: 0,
          status: UserStatus.BLOCKED,
        },
        user,
      );

      expect(users.result).not.toHaveLength(0);
      users.result.forEach((user) => {
        expect(user.status).toEqual(UserStatus.BLOCKED);
      });
      expect(users.count).toEqual(1);
    });

    it('should be delete users', async () => {
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockSuperAdminUser,
        update: jest.fn(),
        destroy: jest.fn(),
      });
      expect(await service.delete(transaction, userId)).toBe(void 0);
    });

    it('should be get error USER_NOT_FOUND after delete user', async () => {
      try {
        mockUserProvider.findByPk.mockResolvedValue(null);
        await service.getById(userId);
        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_NOT_FOUND);
        expect(error.httpCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('User me test', () => {
    it('should be get user me', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer: customer,
      });
      const user = await service.getUserMe(userMeId);

      checkUser(user, mockCustomerUser);
    });

    it('should be update user me', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer: customer,
        update: jest.fn(),
      });
      mockUserProvider.count.mockResolvedValue(0);

      expect(
        await service.updateUsersMe(transaction, userMeId, {
          ...mockUserData,
          firstName: 'Change',
          lastName: 'Name',
        }),
      ).toBe(void 0);
    });

    it('should be get user me after update', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer: customer,
        firstName: 'Change',
        lastName: 'Name',
      });

      const user = await service.getUserMe(userMeId);

      checkUser(user, {
        ...mockCustomerUser,
        firstName: 'Change',
        lastName: 'Name',
      });
    });

    it('should be send verify sms code', async () => {
      mockUserProvider.findByPk.mockResolvedValue({ ...mockCustomerUser, update: jest.fn() });
      mockRedis.setSmsCode.mockResolvedValue('setSmsCode');
      expect(await service.sendVerifySmsCode(userMeId)).toBe(void 0);
    });

    it('should be phone verify false', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer: customer,
        firstName: 'Change',
        lastName: 'Name',
        phoneVerified: false,
      });
      const user = await service.getUserMe(userMeId);

      checkUser(
        user,
        {
          ...mockCustomerUser,
          firstName: 'Change',
          lastName: 'Name',
        },
        undefined,
        false,
      );
    });

    it('should be verify sms code', async () => {
      const code = 'sms_code';
      mockRedis.getSmsCode.mockResolvedValue(await hashString(code));
      mockRedis.delSmsCode.mockResolvedValue('del');
      mockUserProvider.findByPk.mockResolvedValue({ ...mockCustomerUser, update: jest.fn() });
      expect(await service.verifySmsCode(userMeId, { code })).toBe(void 0);
    });

    it('should be phone verify true', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer: customer,
        phoneVerified: true,
      });

      const user = await service.getUserMe(userMeId);

      checkUser(user, mockCustomerUser, undefined, true);
    });

    it('should be verify sms code with error VERIFICATION_CODE_IS_NOT_VALID', async () => {
      const code = 'email_code';
      mockRedis.getSmsCode.mockResolvedValue(await hashString('error_code'));
      mockUserProvider.findByPk.mockResolvedValue(mockCustomerUser);
      try {
        expect(await service.verifySmsCode(userMeId, { code }));

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should be send verify sms code for update phone', async () => {
      const phoneNumber = '+5023333333';
      const code = 'sms_code';
      mockRedis.setSmsCode.mockResolvedValue(await hashString(code));
      mockRedis.set.mockResolvedValue(code);
      mockUserProvider.findByPk.mockResolvedValue({ ...mockCustomerUser, update: jest.fn() });
      expect(
        await service.sendVerifySmsCodeForUpdatePhone(
          userMeId,
          { phoneNumber },
          Platform.AdminPanel,
        ),
      ).toBe(void 0);
    });

    it('should be phone verify false', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer,
        phoneVerified: false,
      });
      const user = await service.getUserMe(userMeId);

      checkUser(user, mockCustomerUser, undefined, false);
    });

    it('should be verify sms code for update phone', async () => {
      mockUserProvider.findByPk.mockResolvedValue(mockCustomerUser);
      const code = 'sms_code';
      mockRedis.getSmsCode.mockResolvedValue(await hashString(code));
      expect(await service.verifySmsCodeForUpdatePhone(userMeId, { code })).toBeDefined();
    });

    it('should be change phone', async () => {
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        phoneVerified: false,
        update: jest.fn(),
      });
      const phoneNumber = '+5023333333';
      const code = 'sms_code';
      mockRedis.getSmsCode.mockResolvedValue(await hashString(code));
      mockRedis.delSmsCode.mockResolvedValue(true);
      mockRedis.del.mockResolvedValue(true);
      mockRedis.get.mockResolvedValue(true);
      expect(await service.changePhone(userMeId, { code, phone: phoneNumber })).toBe(void 0);
    });

    it('should be phone verify true and phone change', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer,
        phoneVerified: true,
      });
      const user = await service.getUserMe(userMeId);

      checkUser(user, mockCustomerUser, undefined, true);
    });

    it('should be send verify email code for change email', async () => {
      const email = 'test+12@test.com';
      const code = 'email_code';
      mockRedis.set.mockResolvedValue({ code: await hashString(code), email: email });
      mockUserProvider.findByPk.mockResolvedValue(mockCustomerUser);
      expect(
        await service.sendVerifyEmailCodeForChangeEmail(userMeId, email, Platform.CustomerApp),
      ).toBe(void 0);
    });

    it('should be verify false', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer,
        verified: false,
        phoneVerified: true,
      });

      const user = await service.getUserMe(userMeId);

      checkUser(user, mockCustomerUser, false, true);
    });

    it('should be change email', async () => {
      const email = 'test+12@test.com';
      const code = 'email_code';
      mockRedis.get.mockResolvedValue({ code: await hashString(code), email: email });
      mockRedis.del.mockResolvedValue(true);
      mockUserProvider.findByPk.mockResolvedValue({ ...mockCustomerUser, update: jest.fn() });
      expect(await service.changeEmail(userMeId, { email, code })).toBe(void 0);
    });

    it('should be verify true and change email', async () => {
      const customer = { id: 1, userId: mockCustomerUser.id, birthday: null };
      mockUserProvider.findByPk.mockResolvedValue({
        ...mockCustomerUser,
        operator: null,
        customer,
        verified: true,
        phoneVerified: true,
      });
      const user = await service.getUserMe(userMeId);

      checkUser(user, mockCustomerUser, true, true);
    });
  });
});
