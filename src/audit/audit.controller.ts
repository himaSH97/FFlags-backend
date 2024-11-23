import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   *
   * Get audit history for a flag and its all values
   *
   */

  @Get('flag/:id')
  getAuditHistoryPerFlag(
    @Param('id') flagId: string,
    @Query('search') search: string = '',
    @Query('limit') pageSize: number = 10,
    @Query('page') pageNumber: number = 1,
  ) {
    return this.auditService.getAuditHistoryPerFlag(
      flagId,
      search,
      pageSize,
      pageNumber,
    );
  }

  /**
   *
   * Get audit history for a flag value
   *
   */

  @Get('flag-value/:id')
  getAuditHistoryPerFlagValueId(@Param('id') flagValueId: string) {
    return this.auditService.getAuditHistoryPerFlagValueId(flagValueId);
  }
}
