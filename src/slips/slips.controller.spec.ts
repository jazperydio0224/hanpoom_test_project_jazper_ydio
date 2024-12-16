import { Test, TestingModule } from '@nestjs/testing';
import { SlipsController } from './slips.controller';
import { SlipsService } from './slips.service';

describe('SlipsController', () => {
  let controller: SlipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlipsController],
      providers: [SlipsService],
    }).compile();

    controller = module.get<SlipsController>(SlipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
