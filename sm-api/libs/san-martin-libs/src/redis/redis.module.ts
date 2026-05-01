import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheStore } from '@nestjs/common/cache';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';
import { redisStore } from 'cache-manager-redis-store';

import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService): CacheOptions => ({
        store: redisStore as unknown as CacheStore,
        host: configService.redis.host,
        port: configService.redis.port,
        url: configService.redis.url,
        password: configService.redis.password,
      }),
      isGlobal: true,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
