import { Test, TestingModule } from '@nestjs/testing';
import { entityProviders, TransactionInspectors } from '@san-martin/san-martin-libs';

import { UsersAddressService } from './users-address.service';
import { UsersMeAddressController } from './users-me-address.controller';

describe('UsersAddressController', () => {
  let controller: UsersMeAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersMeAddressController],
      providers: [UsersAddressService, ...entityProviders.usersAddressProvider],
    })
      .overrideInterceptor(TransactionInspectors)
      .useValue({})
      .compile();

    controller = module.get<UsersMeAddressController>(UsersMeAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
