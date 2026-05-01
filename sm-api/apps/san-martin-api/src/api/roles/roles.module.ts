import { Module } from '@nestjs/common';
import { entityProviders } from '@san-martin/san-martin-libs';

import { RolesAdminController } from './roles.admin.controller';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService, ...entityProviders.rolesProvider],
  controllers: [RolesAdminController],
  exports: [RolesService],
})
export class RolesModule {}
