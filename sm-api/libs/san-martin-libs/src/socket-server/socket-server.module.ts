import { Module } from '@nestjs/common';

import { SocketServerGateway } from './socket-server.gateway';

@Module({
  providers: [SocketServerGateway],
})
export class SocketServerModule {}
