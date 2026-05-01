import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService, SocketServerModule } from '@san-martin/san-martin-libs';

import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middleware/auth-middleware';
import { CountriesModule } from './countries/countries.module';
import { DeliveryZonesModule } from './delivery-zones/delivery-zones.module';
import { GuestModule } from './guest/guest.module';
import { HealthModule } from './health/health.module';
import { RolesModule } from './roles/roles.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { UsersAddressModule } from './users-address/users-address.module';
import { UsersNotificationsModule } from './users-notifications/users-notifications.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        global: true,
        secret: appConfigService.jwtSecret,
      }),
    }),
    HealthModule,
    RolesModule,
    AuthModule,
    UsersModule,
    CountriesModule,
    StoresModule,
    DeliveryZonesModule,
    UsersAddressModule,
    GuestModule,
    UsersNotificationsModule,
    SocketServerModule,
  ],
  exports: [
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        global: true,
        secret: appConfigService.jwtSecret,
      }),
    }),
    HealthModule,
    RolesModule,
    AuthModule,
    UsersModule,
    CountriesModule,
    StoresModule,
    DeliveryZonesModule,
    UsersAddressModule,
    GuestModule,
    UsersNotificationsModule,
    SocketServerModule,
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/v2/auth/checking-user-existence/:email', method: RequestMethod.GET },
        { path: '/v2/auth/user/sign-in', method: RequestMethod.POST },
        { path: '/v2/auth/user/refresh', method: RequestMethod.POST },
        { path: '/v2/auth/customer/sign-up', method: RequestMethod.POST },
        { path: '/v2/auth/user/verify-email', method: RequestMethod.POST },
        { path: '/v2/auth/user/resend-verification-code/:email', method: RequestMethod.POST },
        { path: '/v2/auth/user/send-reset-password-code/:email', method: RequestMethod.POST },
        { path: '/v2/auth/user/verify-reset-password-code', method: RequestMethod.POST },
        { path: '/v2/auth/user/reset-password', method: RequestMethod.POST },
        { path: '/v2/auth/customer/social/checking-existence', method: RequestMethod.POST },
        { path: '/v2/auth/customer/social/sign-in', method: RequestMethod.POST },
        { path: '/v2/auth/customer/social/sign-up', method: RequestMethod.POST },
        { path: 'v2/versions/:os', method: RequestMethod.GET },
        { path: 'v2/users/reset-change', method: RequestMethod.GET },
        { path: 'v2/guest/token', method: RequestMethod.GET },
        { path: 'v2/health', method: RequestMethod.GET },
        { path: 'v2/health/detailed', method: RequestMethod.GET },
        { path: 'v2/health/readiness', method: RequestMethod.GET },
        { path: 'v2/health/liveness', method: RequestMethod.GET },
      )
      .forRoutes('/');
  }
}
