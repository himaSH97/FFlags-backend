import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { FlagValuesService } from './flag-values.service';
import { CreateFlagValueDto } from './dto/create-flag-value.dto';
import { ExpressRequestWithAuth } from '@clerk/express';

@Controller('flag-values')
export class FlagValuesController {
  constructor(private readonly flagValuesService: FlagValuesService) {}

  /**
   *
   * Update flag value for a given flag value id
   *
   */
  @Patch(':id/value')
  updateFlagValue(
    @Param('id') flagValueId: string,
    @Body() updateFlagValueDto: any,
    @Req() req: ExpressRequestWithAuth,
  ) {
    return this.flagValuesService.updateFlagValue(
      flagValueId,
      req.auth.userId as string,
      updateFlagValueDto,
    );
  }
}
