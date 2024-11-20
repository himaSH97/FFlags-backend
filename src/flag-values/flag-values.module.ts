import { Module } from '@nestjs/common';
import { FlagValuesService } from './flag-values.service';
import { FlagValuesController } from './flag-values.controller';

@Module({
  controllers: [FlagValuesController],
  providers: [FlagValuesService],
})
export class FlagValuesModule {}
