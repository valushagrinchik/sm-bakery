import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  AppConfigModule,
  AppConfigService,
  MicroserviceChanelName,
  RabbitMqModule,
  RedisService,
} from '@san-martin/san-martin-libs';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

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
    AppConfigModule,
    UsersModule,
    RabbitMqModule.register({ name: MicroserviceChanelName.EMAIL_SERVICE }),
  ],
  providers: [AuthService, RedisService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
