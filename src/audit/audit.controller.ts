import { Controller, Get, Param } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('flag/:id')
  getAuditHistoryPerFlag(@Param('id') flagId: string) {
    return this.auditService.getAuditHistoryPerFlag(flagId);
  }

  @Get('flag-value/:id')
  getAuditHistoryPerFlagValueId(@Param('id') flagValueId: string) {
    return this.auditService.getAuditHistoryPerFlagValueId(flagValueId);
  }
}
