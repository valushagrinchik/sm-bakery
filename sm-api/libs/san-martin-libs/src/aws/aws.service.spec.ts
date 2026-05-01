import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService } from '@san-martin/san-martin-libs';

import { AwsService } from './aws.service';

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [AwsService, AppConfigService],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
