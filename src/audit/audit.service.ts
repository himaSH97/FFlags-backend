import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { auditHistory, featureFlagValues } from 'src/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { identity } from 'rxjs';

@Injectable()
export class AuditService {
  async getAuditHistoryPerFlag(flagId: string) {
    const flagValueListForFlagId = await db
      .select({ id: featureFlagValues.id })
      .from(featureFlagValues)
      .where(eq(featureFlagValues.flagId, flagId))
      .execute();

    const flagValueIdList = flagValueListForFlagId.map((item) => item.id);
    flagValueIdList.push(flagId);

    return this.getAuditHistoryFromIds(flagValueIdList);
  }

  async getAuditHistoryFromIds(flagValueIdList: string[]) {
    const auditHistoryList = await db
      .select()
      .from(auditHistory)
      .where(inArray(auditHistory.entityId, flagValueIdList))
      .execute();
    return auditHistoryList;
  }

  async getAuditHistoryPerFlagValueId(flagValueId: string) {
    const auditHistoryList = await db
      .select()
      .from(auditHistory)
      .where(eq(auditHistory.entityId, flagValueId))
      .execute();

    return auditHistoryList;
  }
}
