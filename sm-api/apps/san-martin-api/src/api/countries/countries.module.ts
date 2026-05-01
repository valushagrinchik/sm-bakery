import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppConfigService, entityProviders } from '@san-martin/san-martin-libs';

import { CountriesAdminController } from './countries.admin.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [HttpModule],
  providers: [...entityProviders.countriesProvider, CountriesService, AppConfigService],
  controllers: [CountriesAdminController],
})
export class CountriesModule {}
