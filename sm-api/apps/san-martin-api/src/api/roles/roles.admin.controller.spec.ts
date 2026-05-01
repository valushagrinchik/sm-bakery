import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { entityProviders } from '@san-martin/san-martin-libs';

import { RolesAdminController } from './roles.admin.controller';
import { RolesService } from './roles.service';

describe('RolesAdminController', () => {
  let controller: RolesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, ...entityProviders.rolesProvider],
      controllers: [RolesAdminController],
    }).compile();

    controller = module.get<RolesAdminController>(RolesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
