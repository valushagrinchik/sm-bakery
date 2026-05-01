import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppConfigModule,
  AppConfigService,
  ErrorMessageEnum,
  OperationError,
  Platform,
} from '@san-martin/san-martin-libs';

import { GuestService } from './guest.service';

describe('GuestService', () => {
  let service: GuestService;

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
    }).compile();

    service = module.get<GuestService>(GuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test generate guest token', () => {
    it('should be generate token', async () => {
      mockJwtService.signAsync.mockResolvedValue('tes-token');

      expect(await service.createGuestToken(Platform.CustomerApp)).toEqual({
        accessToken: 'tes-token',
      });
    });

    it('should be get error user_platform_error', async () => {
      try {
        await service.createGuestToken(Platform.OperatorApp);

        fail('Expected an error to be thrown, but none was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(OperationError);
        expect(error.message).toBe(ErrorMessageEnum.USER_PLATFORM_ERROR);
        expect(error.httpCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
