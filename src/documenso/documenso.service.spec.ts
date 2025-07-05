import { Test, TestingModule } from '@nestjs/testing';
import { DocumensoService } from './documenso.service';

describe('DocumensoService', () => {
  let service: DocumensoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumensoService],
    }).compile();

    service = module.get<DocumensoService>(DocumensoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
