import { Test, TestingModule } from '@nestjs/testing';
import { FlagValuesController } from './flag-values.controller';
import { FlagValuesService } from './flag-values.service';

describe('FlagValuesController', () => {
  let controller: FlagValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagValuesController],
      providers: [FlagValuesService],
    }).compile();

    controller = module.get<FlagValuesController>(FlagValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
