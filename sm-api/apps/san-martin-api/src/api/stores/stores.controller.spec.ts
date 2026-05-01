import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigModule,
  AppConfigService,
  TransactionInspectors,
} from '@san-martin/san-martin-libs';

import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

describe('StoresController', () => {
  let controller: StoresController;

  const mokStoresService = {
    create: jest.fn(),
    getStoresList: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [StoresController],
      providers: [
        AppConfigService,
        { provide: StoresService, useValue: mokStoresService },
        { provide: HttpService, useValue: {} },
      ],
    })
      .overrideInterceptor(TransactionInspectors)
      .useValue({})
      .compile();

    controller = module.get<StoresController>(StoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
