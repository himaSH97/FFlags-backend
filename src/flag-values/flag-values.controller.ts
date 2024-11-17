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

  @Post()
  create(@Body() createFlagValueDto: CreateFlagValueDto) {
    return this.flagValuesService.create(createFlagValueDto);
  }

  @Get()
  findAll() {
    return this.flagValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flagValuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlagValueDto: any) {
    return this.flagValuesService.update(+id, updateFlagValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flagValuesService.remove(+id);
  }

  @Patch(':id/value')
  updateFlagValue(
    @Param('id') id: string,
    @Body() updateFlagValueDto: any,
    @Req() req: ExpressRequestWithAuth,
  ) {
    return this.flagValuesService.updateFlagValue(
      id,
      req.auth.userId as string,
      updateFlagValueDto,
    );
  }
}
