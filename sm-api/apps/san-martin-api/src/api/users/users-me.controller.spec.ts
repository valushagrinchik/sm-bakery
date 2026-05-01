import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigModule,
  AppConfigService,
  AwsService,
  BullQueueService,
  entityProviders,
  MicroserviceChanelName,
  RabbitMqModule,
  RedisService,
  TransactionInspectors,
} from '@san-martin/san-martin-libs';

import { UsersMeController } from './users-me.controller';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';

describe('UsersMeController', () => {
  let controller: UsersMeController;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RabbitMqModule.register({ name: MicroserviceChanelName.EMAIL_SERVICE }),
        RabbitMqModule.register({ name: MicroserviceChanelName.SMS_SERVICE }),
        RolesModule,
        AppConfigModule,
      ],
      providers: [
        JwtService,
        UsersService,
        AppConfigService,
        { provide: RedisService, useValue: mockRedis },
        { provide: AwsService, useValue: mockAwsService },
        { provide: BullQueueService, useValue: mockBullQueue },
        ...entityProviders.userProviders,
        ...entityProviders.customersProvider,
        ...entityProviders.operatorsProvider,
        ...entityProviders.rolesProvider,
        ...entityProviders.usersAddressProvider,
        ...entityProviders.storeDeliveryZonesProvider,
        ...entityProviders.versionsProvider,
      ],
      controllers: [UsersMeController],
    })
      .overrideInterceptor(TransactionInspectors)
      .useValue({})
      .compile();

    controller = module.get<UsersMeController>(UsersMeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
