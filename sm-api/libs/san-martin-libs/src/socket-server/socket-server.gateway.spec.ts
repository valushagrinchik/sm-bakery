import { Test, TestingModule } from '@nestjs/testing';

import { SocketServerGateway } from './socket-server.gateway';

describe('SocketServerGateway', () => {
  let gateway: SocketServerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketServerGateway],
    }).compile();

    gateway = module.get<SocketServerGateway>(SocketServerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
