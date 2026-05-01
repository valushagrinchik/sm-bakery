import { Module } from '@nestjs/common';
import { AppConfigModule } from '@san-martin/san-martin-libs/app-config/app-config.module';
import { AppConfigService } from '@san-martin/san-martin-libs/app-config/app-config.service';

import { SocketService } from './socket.service';

@Module({
  imports: [AppConfigModule],
  providers: [SocketService, AppConfigService],
  exports: [SocketService],
})
export class SocketModule {}
