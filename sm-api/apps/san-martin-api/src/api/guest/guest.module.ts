import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';

import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        global: true,
        secret: appConfigService.jwtSecret,
      }),
    }),
  ],
  providers: [GuestService],
  controllers: [GuestController],
})
export class GuestModule {}
