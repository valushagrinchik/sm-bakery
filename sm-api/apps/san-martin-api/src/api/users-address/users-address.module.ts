import { Module } from '@nestjs/common';
import { entityProviders } from '@san-martin/san-martin-libs';

import { UsersAddressService } from './users-address.service';
import { UsersMeAddressController } from './users-me-address.controller';

@Module({
  providers: [UsersAddressService, ...entityProviders.usersAddressProvider],
  controllers: [UsersMeAddressController],
})
export class UsersAddressModule {}
