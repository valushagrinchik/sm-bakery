import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService, entityProviders } from '@san-martin/san-martin-libs';

import { CountriesAdminController } from './countries.admin.controller';
import { CountriesService } from './countries.service';

describe('CountriesAdminController', () => {
  let controller: CountriesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [
        ...entityProviders.countriesProvider,
        CountriesService,
        AppConfigService,
        { provide: HttpService, useValue: {} },
      ],
      controllers: [CountriesAdminController],
    }).compile();
    controller = module.get<CountriesAdminController>(CountriesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
