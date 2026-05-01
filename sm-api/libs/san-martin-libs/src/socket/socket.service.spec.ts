import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [SocketService, AppConfigService],
    }).compile();

    service = module.get<SocketService>(SocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
