import { Injectable } from '@nestjs/common';
import { and, eq, ilike, sql, inArray, asc, desc } from 'drizzle-orm';
import { DEAFULT_PROJECT_ROLE } from 'src/constants';
import { db } from 'src/db';
import {
  auditEntityTypeEnum,
  auditHistory,
  featureFlags,
  featureFlagValues,
  projectKeys,
  projectRoles,
  projects,
  users,
  usersOnProjects,
} from 'src/db/schema';
import { Doc } from 'src/db/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import * as forge from 'node-forge';
import { BadRequestException } from '@nestjs/common';
import { createKeyFromName } from 'src/utils';
import ClerkUtils from 'src/utils/clerk.utils';

interface FlagInfo {
  feature_flags: Doc<'featureFlags'>;
  feature_flag_values: Doc<'featureFlagValues'>[];
}
const maxProjects = 2;
const maxProjectRoles = 10;
@Injectable()
export class ProjectsService {
  async create(createProjectDto: CreateProjectDto, userId: string) {
    /**
     * Create a new Project in the database.
     * Add a new FF_Default Role for the Project.
     * Return the created project.
     *
     */

    const { name, description } = createProjectDto;

    const newRows = await db.transaction(async (tx) => {
      const projectCount = await db.$count(projects);

      if (projectCount >= maxProjects) {
        throw new BadRequestException(
          `The total number of projects cannot exceed ${maxProjects}.`,
        );
      }
      const newProject = await tx
        .insert(projects)
        .values({
          createdBy: userId,
          name,
          description,
        })
        .returning()
        .execute();

      const keys = this.generateProjectKeys();

      const newProjectKeys = await tx
        .insert(projectKeys)
        .values({
          projectId: newProject[0].id,
          serverPublicKey: keys.serverPublicKey,
          serverPrivateKey: keys.serverPrivateKey,
          projectPublicKey: keys.projectPublicKey,
          projectPrivateKey: keys.projectPrivateKey,
        })
        .execute();

      const userOnProject = await tx
        .insert(usersOnProjects)
        .values({
          userId: userId,
          projectId: newProject[0].id,
          role: 'owner',
          status: 'active',
        })
        .returning()
        .execute();
      const newRole = await tx
        .insert(projectRoles)
        .values({
          projectId: newProject[0].id,
          projectRole: DEAFULT_PROJECT_ROLE,
        })
        .returning()
        .execute();

      return { project: newProject[0], projectRole: newRole[0] };
    });

    return newRows;
  }

  async findAll(projectList: string[]): Promise<Doc<'projects'>[]> {
    const projectsList = await db.select().from(projects).where(inArray(projects.id, projectList)).execute();
    return projectsList;
  }

  async findFlags(projectId: string, search: string, pageSize: number, pageNumber: number) {
    const offset = (pageNumber - 1) * pageSize;
    const conditions = and(eq(featureFlags.projectId, projectId), ilike(featureFlags.name, `%${search}%`));

    const combinedQuery = db
      .select({
        total: sql`COUNT(*) OVER()`,
        id: featureFlags.id,
        projectId: featureFlags.projectId,
        name: featureFlags.name,
        isAdvanced: featureFlags.isAdvanced,
        description: featureFlags.description,
        createdAt: featureFlags.createdAt,
        updatedAt: featureFlags.updatedAt,
      })
      .from(featureFlags)
      .where(conditions)
      .limit(Number(pageSize))
      .offset(Number(offset));

    const result = await combinedQuery.execute();
    const totalRecords = result.length > 0 ? Number(result[0].total) : 0;
    const flagsList = result.map(({ total, ...rest }) => rest);
    return {
      totalRecords,
      flagsList,
    };
  }

  async updateFlagSettings(projectId: string, flagId: string, createFeatureFlagDto: any, userId: string) {
    const { isAdvanced } = createFeatureFlagDto;
    console.log('🚀 ~ ProjectsService ~ updateFlagSettings ~ isAdvanced:', isAdvanced);
    const updated = await db.transaction(async (tx) => {
      const flagInfo = await tx
        .select()
        .from(featureFlags)
        .where(and(eq(featureFlags.projectId, projectId), eq(featureFlags.id, flagId)))
        .execute();
      const newFlag = await tx
        .update(featureFlags)
        .set({ isAdvanced: isAdvanced, updatedAt: sql`NOW()` })
        .where(and(eq(featureFlags.id, flagId)))
        .returning();

      const changedFields = {
        previous: {
          isAdvanced: flagInfo[0].isAdvanced,
        },
        current: {
          isAdvanced: newFlag[0].isAdvanced,
        },
      };
      const auditRec = await tx
        .insert(auditHistory)
        .values({
          entityId: flagId,
          entityType: 'feature_flags',
          entityAction: 'update',
          changedBy: userId,
          changedAt: new Date(),
          changedFields: changedFields,
        })
        .returning()
        .execute();

      return newFlag;
    });

    console.log(updated);
    return updated;
  }

  async createFlags(projectId: string, createFeatureFlagDto: any, userId: string) {
    const { name, description, isAdvanced } = createFeatureFlagDto;

    const flagKey = createKeyFromName(name);
    const existigFlag = await db.select().from(featureFlags).where(eq(featureFlags.flagKey, flagKey)).execute();

    if (existigFlag.length > 0) {
      throw new Error('Flag with this name already exists');
    }

    const newRows = await db.transaction(async (tx) => {
      const newFlag = await tx
        .insert(featureFlags)
        .values({ projectId, name, description, isAdvanced, flagKey: flagKey })
        .returning()
        .execute();

      const projectRolesList = await tx
        .select()
        .from(projectRoles)
        .where(eq(projectRoles.projectId, projectId))
        .execute();

      let flagValues = projectRolesList.map((role) => ({
        flagId: newFlag[0].id,
        value: false,
        roleId: role.id,
        projectRole: role.projectRole,
      }));

      if (!isAdvanced) {
        flagValues = flagValues.filter((role) => role.projectRole === DEAFULT_PROJECT_ROLE);
      }

      const flagValue = await tx.insert(featureFlagValues).values(flagValues).returning().execute();
      /**
       *
       * Audit History for the flag and its values
       *
       */
      const auditRecords = flagValue.map(
        (value) =>
          ({
            entityId: value.id,
            entityType: 'feature_flag_values',
            entityAction: 'create',
            changedBy: userId,
            changedAt: value.createdAt,
            changedFields: {
              previous: {
                value: null,
              },
              current: {
                value: value.value,
              },
            },
          }) as Omit<Doc<'auditHistory'>, 'id'>,
      );
      await tx.insert(auditHistory).values(auditRecords).execute();

      await tx
        .insert(auditHistory)
        .values({
          entityId: newFlag[0].id,
          entityType: 'feature_flags',
          entityAction: 'create',
          changedBy: userId,
          changedAt: newFlag[0].createdAt,
          changedFields: {
            previous: {
              name: null,
              description: null,
            },
            current: {
              name: newFlag[0].name,
              description: newFlag[0].description,
            },
          },
        })
        .execute();

      return { flag: newFlag[0], flagValue };
    });
    return newRows;
  }

  async getProjectRoles(projectId: string) {
    const projectRolesList = await db
      .select()
      .from(projectRoles)
      .where(eq(projectRoles.projectId, projectId))
      .execute();
    return projectRolesList;
  }

  async getFlagInfo(projectId: string, flagId: string) {
    /**
     *
     * Get basic feature flag info
     *
     */
    const flagInfo = await db
      .select()
      .from(featureFlags)
      .where(and(eq(featureFlags.projectId, projectId), eq(featureFlags.id, flagId)))
      .execute();

    /**
     *
     * Get basic feature flag values
     *
     */
    const flagValues = await db
      .select({
        id: featureFlagValues.id,
        value: featureFlagValues.value,
        roleId: featureFlagValues.roleId,
        projectRoleName: projectRoles.projectRole,
        flagId: featureFlagValues.flagId,
      })
      .from(featureFlagValues)
      .leftJoin(projectRoles, eq(featureFlagValues.roleId, projectRoles.id))
      .where(eq(featureFlagValues.flagId, flagId))
      .orderBy(asc(featureFlagValues.createdAt))
      .execute();

    /**
     * if not advanced return only deafult value
     */
    if (!flagInfo[0]?.isAdvanced) {
      return {
        featureFlags: flagInfo[0],
        featureFlagValues: flagValues.filter((value) => value.projectRoleName === DEAFULT_PROJECT_ROLE),
      };
    }
    /**
     * if advanced return all values
     */
    return {
      featureFlags: flagInfo[0],
      featureFlagValues: flagValues,
    };
  }

  async getFlagBasicDetails(projectId: string, flagId: string) {
    const flagInfo = await db
      .select()
      .from(featureFlags)
      .where(and(eq(featureFlags.projectId, projectId), eq(featureFlags.id, flagId)))
      .execute();

    const flagValueListForFlagId = await db
      .select({ id: featureFlagValues.id })
      .from(featureFlagValues)
      .where(eq(featureFlagValues.flagId, flagId))
      .execute();

    const flagValueIdList = flagValueListForFlagId.map((item) => item.id);
    flagValueIdList.push(flagId);

    const createdAtRecord = await db
      .select()
      .from(auditHistory)
      .where(
        and(
          eq(auditHistory.entityId, flagId),
          eq(auditHistory.entityType, 'feature_flags'),
          eq(auditHistory.entityAction, 'create'),
        ),
      )
      .limit(1);

    const lastUpdatedRecord = await db
      .select()
      .from(auditHistory)
      .where(inArray(auditHistory.entityId, flagValueIdList))
      .orderBy(desc(auditHistory.changedAt))
      .limit(1);

    const userIds = [...createdAtRecord, ...lastUpdatedRecord].map((record) => record.changedBy);

    const uniqueUserIds = [...new Set(userIds)];

    const interactedUsers = await db
      .select({ clerkUserId: users.clerkUserId, id: users.id, email: users.email })
      .from(users)
      .where(inArray(users.id, uniqueUserIds))
      .execute();

    const clerkIds = interactedUsers.map((user) => user.clerkUserId);

    const clerkUsers = await ClerkUtils.getClerkUsers(clerkIds as string[]);
    const userMap = ClerkUtils.getUserFields(clerkUsers);

    const createdRecClerkid = interactedUsers.find((user) => user.id === createdAtRecord[0].changedBy);

    const lastUpdatedRecClerkid = interactedUsers.find((user) => user.id === lastUpdatedRecord[0].changedBy);

    const createdRec = {
      ...createdAtRecord[0],
      metadata: {
        ...userMap[createdRecClerkid?.clerkUserId ?? ''],
        email: createdRecClerkid?.email,
      },
    };

    const lastUpdatedRec = {
      ...lastUpdatedRecord[0],
      metadata: {
        ...userMap[lastUpdatedRecClerkid?.clerkUserId ?? ''],
        email: lastUpdatedRecClerkid?.email,
      },
    };

    return {
      flagInfo: flagInfo[0],
      createdAtRecord: createdRec,
      lastUpdatedRecord: lastUpdatedRec,
    };
  }

  async createProjectRole(projectId: string, createProjectRoleDto: CreateRoleDto) {
    const { name, description } = createProjectRoleDto;

    const newRows = await db.transaction(async (tx) => {
      const projectRolesCount = await db.$count(projectRoles);
      console.log(projectRolesCount);
      if (projectRolesCount >= maxProjectRoles) {
        throw new BadRequestException(
          `The total number of projects cannot exceed ${maxProjectRoles}.`,
        );
      }
      const newProjectRole = await tx
        .insert(projectRoles)
        .values({
          projectId: projectId,
          projectRole: name.toUpperCase(),
          description,
        })
        .returning()
        .execute();

      return { projectRole: newProjectRole[0] };
    });

    return newRows;
  }

  async removeProjectRole(roleId: string) {
    const deletedRow = await db.delete(projectRoles).where(eq(projectRoles.id, roleId)).returning().execute();

    return deletedRow;
  }

  generateProjectKeys() {
    const senderKeypair = forge.pki.rsa.generateKeyPair({
      bits: 2048,
      e: 0x10001,
    });
    const recipientKeypair = forge.pki.rsa.generateKeyPair({
      bits: 2048,
      e: 0x10001,
    });
    const serverPublicKey = forge.pki.publicKeyToPem(senderKeypair.publicKey);
    const serverPrivateKey = forge.pki.privateKeyToPem(senderKeypair.privateKey);
    const projectPublicKey = forge.pki.publicKeyToPem(recipientKeypair.publicKey);
    const projectPrivateKey = forge.pki.privateKeyToPem(recipientKeypair.privateKey);
    return {
      serverPublicKey,
      serverPrivateKey,
      projectPublicKey,
      projectPrivateKey,
    };
  }

  async getProjectKeys(projectId: string) {
    const keys = await db.select().from(projectKeys).where(eq(projectKeys.projectId, projectId)).execute();

    if (keys.length === 0) {
      throw new Error('No keys found for the given projectId');
    }

    return [
      {
        id: 1,
        value: forge.util.encode64(keys[0].serverPublicKey),
        name: 'Public Key',
      },
      {
        id: 2,
        value: forge.util.encode64(keys[0].projectPrivateKey),
        name: 'Secret Key',
      },
      {
        id: 3,
        value: forge.util.encode64(keys[0].projectId),
        name: 'Project Key',
      },
    ];
  }
}
