import { Injectable } from '@nestjs/common';
import { CreateFlagValueDto } from './dto/create-flag-value.dto';
import { UpdateFlagValueDto } from './dto/update-flag-value.dto';
import { db } from 'src/db';
import { auditHistory, featureFlagValues } from 'src/db/schema';
import { and, count, eq, ilike, is, like, sql } from 'drizzle-orm';
import { generateChangedFields } from 'src/utils';

@Injectable()
export class FlagValuesService {
  create(createFlagValueDto: CreateFlagValueDto) {
    return 'This action adds a new flagValue';
  }

  findAll() {
    return `This action returns all flagValues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flagValue`;
  }

  update(id: number, updateFlagValueDto: UpdateFlagValueDto) {
    return `This action updates a #${id} flagValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} flagValue`;
  }

  async updateFlagValue(id: string, userId: string, updateFlagValueDto: any) {
    console.log(
      '🚀 ~ FlagValuesService ~ updateFlagValue ~ updateFlagValueDto:',
      updateFlagValueDto,
    );
    const updatedFlagValue = await db.transaction(async (tx) => {
      const prevFlagValue = await tx
        .select()
        .from(featureFlagValues)
        .where(eq(featureFlagValues.id, id))
        .execute();
      const updatedFlagValue = await tx
        .update(featureFlagValues)
        .set({
          value: updateFlagValueDto.flagValue,
          updatedAt: sql`NOW()`,
        })
        .where(eq(featureFlagValues.id, id))
        .returning()
        .execute();

      const prev = { ...prevFlagValue[0] };
      const curr = { ...updatedFlagValue[0] };

      const changedFields = generateChangedFields(prev, curr);

      const auditRec = await tx
        .insert(auditHistory)
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
}
