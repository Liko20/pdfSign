import { Test, TestingModule } from '@nestjs/testing';
import { DocumensoApiService } from './documenso-api.service';

describe('DocumensoApiService', () => {
  let service: DocumensoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumensoApiService],
    }).compile();

    service = module.get<DocumensoApiService>(DocumensoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
