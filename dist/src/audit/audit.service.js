"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const express_1 = require("@clerk/express");
const clerk_utils_1 = require("../utils/clerk.utils");
let AuditService = class AuditService {
    async getAuditHistoryPerFlag(flagId, search, pageSize, pageNumber) {
        const offset = (pageNumber - 1) * pageSize;
        const flagValueListForFlagId = await db_1.db
            .select({ id: schema_1.featureFlagValues.id })
            .from(schema_1.featureFlagValues)
            .where((0, drizzle_orm_1.eq)(schema_1.featureFlagValues.flagId, flagId))
            .execute();
        const flagValueIdList = flagValueListForFlagId.map((item) => item.id);
        flagValueIdList.push(flagId);
        const auditHistoryList = await db_1.db
            .select({
            id: schema_1.auditHistory.id,
            entityId: schema_1.auditHistory.entityId,
            entityType: schema_1.auditHistory.entityType,
            entityAction: schema_1.auditHistory.entityAction,
            changedAt: schema_1.auditHistory.changedAt,
            changedBy: schema_1.auditHistory.changedBy,
            changedFields: schema_1.auditHistory.changedFields,
            metadata: {
                id: schema_1.users.id,
                email: schema_1.users.email,
                userId: schema_1.users.clerkUserId,
                auditRecordId: schema_1.auditHistory.id,
                roleName: schema_1.projectRoles.projectRole,
            },
        })
            .from(schema_1.auditHistory)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditHistory.changedBy, schema_1.users.id))
            .leftJoin(schema_1.featureFlagValues, (0, drizzle_orm_1.eq)(schema_1.auditHistory.entityId, schema_1.featureFlagValues.id))
            .leftJoin(schema_1.projectRoles, (0, drizzle_orm_1.eq)(schema_1.featureFlagValues.roleId, schema_1.projectRoles.id))
            .where((0, drizzle_orm_1.inArray)(schema_1.auditHistory.entityId, flagValueIdList))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.auditHistory.changedAt))
            .offset(offset)
            .limit(pageSize)
            .execute();
        const userIds = auditHistoryList
            .map((result) => result.metadata.userId)
            .filter((userId) => typeof userId === 'string');
        const clerkUsers = await express_1.clerkClient.users.getUserList({
            userId: [...userIds],
        });
        const userMap = (0, clerk_utils_1.getUserFields)(clerkUsers.data);
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
    async getAuditHistoryPerFlagValueId(flagValueId) {
        const auditHistoryList = await db_1.db
            .select()
            .from(schema_1.auditHistory)
            .where((0, drizzle_orm_1.eq)(schema_1.auditHistory.entityId, flagValueId))
            .execute();
        return auditHistoryList;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)()
], AuditService);
//# sourceMappingURL=audit.service.js.map