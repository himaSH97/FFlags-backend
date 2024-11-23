import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { auditHistory, featureFlagValues, users } from 'src/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import { User, clerkClient } from '@clerk/express';
import { getUserFields } from 'src/utils/clerk.utils';

@Injectable()
export class AuditService {
  async getAuditHistoryPerFlag(
    flagId: string,
    search: string,
    pageSize: number,
    pageNumber: number,
  ) {
    const offset = (pageNumber - 1) * pageSize;
    const flagValueListForFlagId = await db
      .select({ id: featureFlagValues.id })
      .from(featureFlagValues)
      .where(eq(featureFlagValues.flagId, flagId))
      .execute();

    const flagValueIdList = flagValueListForFlagId.map((item) => item.id);
    flagValueIdList.push(flagId);

    const auditHistoryList = await db
      .select({
        id: auditHistory.id,
        entityId: auditHistory.entityId,
        entityType: auditHistory.entityType,
        entityAction: auditHistory.entityAction,
        changedAt: auditHistory.changedAt,
        changedBy: auditHistory.changedBy,
        changedFields: auditHistory.changedFields,
        metadata: {
          id: users.id,
          email: users.email,
          userId: users.clerkUserId,
          auditRecordId: auditHistory.id,
        },
      })
      .from(auditHistory)
      .leftJoin(users, eq(auditHistory.changedBy, users.id))
      .where(inArray(auditHistory.entityId, flagValueIdList))
      .orderBy(desc(auditHistory.changedAt))
      .offset(offset)
      .limit(pageSize)

      .execute();
    const userIds = auditHistoryList
      .map((result) => result.metadata.userId)
      .filter((userId): userId is string => typeof userId === 'string');

    console.log('🚀 ~ AuditService ~ userIds:', userIds);
    const clerkUsers = await clerkClient.users.getUserList({
      userId: [...userIds],
    });
    const userMap = getUserFields(clerkUsers.data);

    const updatedAuditHistoryList = auditHistoryList.map((result) => {
      const userId = result.metadata.userId;
      if (userId && userMap[userId]) {
        const clerkUserInfo = userMap[userId];
        return {
          ...result,
          metadata: {
            ...result.metadata,
            ...clerkUserInfo,
          },
        };
      }
      return result;
    });

    return updatedAuditHistoryList;
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
