import { Test, TestingModule } from '@nestjs/testing';
import { FlagValuesService } from './flag-values.service';

describe('FlagValuesService', () => {
  let service: FlagValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagValuesService],
    }).compile();

    service = module.get<FlagValuesService>(FlagValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
