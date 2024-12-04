"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagValuesService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const utils_1 = require("../utils");
let FlagValuesService = class FlagValuesService {
    async updateFlagValue(id, userId, updateFlagValueDto) {
        const updatedFlagValue = await db_1.db.transaction(async (tx) => {
            const prevFlagValue = await tx
                .select()
                .from(schema_1.featureFlagValues)
                .where((0, drizzle_orm_1.eq)(schema_1.featureFlagValues.id, id))
                .execute();
            const updatedFlagValue = await tx
                .update(schema_1.featureFlagValues)
                .set({
                value: updateFlagValueDto.flagValue,
                updatedAt: (0, drizzle_orm_1.sql) `NOW()`,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.featureFlagValues.id, id))
                .returning()
                .execute();
            const prev = { ...prevFlagValue[0] };
            const curr = { ...updatedFlagValue[0] };
            const changedFields = (0, utils_1.generateChangedFields)(prev, curr, ['updatedAt']);
            const auditRec = await tx
                .insert(schema_1.auditHistory)
                .values({
                entityId: updatedFlagValue[0].id,
                entityType: 'feature_flag_values',
                entityAction: 'update',
                changedBy: userId,
                changedAt: updatedFlagValue[0].updatedAt,
                changedFields: changedFields,
            })
                .returning()
                .execute();
            return updatedFlagValue;
        });
        return updatedFlagValue;
    }
    async createFlagValue(id, userId, createFlagValueDto) {
        const newFlag = await db_1.db
            .insert(schema_1.featureFlagValues)
            .values({
            flagId: id,
            roleId: createFlagValueDto.role,
        })
            .returning()
            .execute();
        return newFlag;
    }
};
exports.FlagValuesService = FlagValuesService;
exports.FlagValuesService = FlagValuesService = __decorate([
    (0, common_1.Injectable)()
], FlagValuesService);
//# sourceMappingURL=flag-values.service.js.map