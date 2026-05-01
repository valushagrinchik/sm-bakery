import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AppConfigModule, DatabaseModule, RedisModule } from '@san-martin/san-martin-libs';

@Module({
  imports: [AppConfigModule, DatabaseModule, RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}
