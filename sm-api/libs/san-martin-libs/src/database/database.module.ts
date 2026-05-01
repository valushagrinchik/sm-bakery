import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfigModule } from '@san-martin/san-martin-libs/app-config/app-config.module';

import { entities } from './entities';
import { AppConfigService } from '../app-config/app-config.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const url = new URL(configService.database.url);
        return {
          dialect: 'postgres',
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          username: url.username,
          password: url.password,
          database: url.pathname.slice(1), // Remove leading slash
          autoLoadModels: true,
          logging: false,
          models: [...entities],
          // sync: { alter: true },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
