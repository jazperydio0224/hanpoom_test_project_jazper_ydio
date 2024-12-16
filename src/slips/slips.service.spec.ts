import { Test, TestingModule } from '@nestjs/testing';
import { SlipsService } from './slips.service';

describe('SlipsService', () => {
  let service: SlipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlipsService],
    }).compile();

    service = module.get<SlipsService>(SlipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
