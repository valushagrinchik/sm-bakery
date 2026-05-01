import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';

import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

describe('GuestController', () => {
  let controller: GuestController;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [
        GuestService,
        AppConfigService,
        { provide: JwtService, useValue: mockJwtService },
      ],
      controllers: [GuestController],
    }).compile();

    controller = module.get<GuestController>(GuestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
