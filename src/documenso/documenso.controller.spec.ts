import { Test, TestingModule } from '@nestjs/testing';
import { DocumensoController } from './documenso.controller';
import { DocumensoService } from './documenso.service';

describe('DocumensoController', () => {
  let controller: DocumensoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumensoController],
      providers: [DocumensoService],
    }).compile();

    controller = module.get<DocumensoController>(DocumensoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
