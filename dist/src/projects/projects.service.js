"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const constants_1 = require("../constants");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const forge = require("node-forge");
const utils_1 = require("../utils");
let ProjectsService = class ProjectsService {
    async create(createProjectDto, userId) {
        const { name, description } = createProjectDto;
        const newRows = await db_1.db.transaction(async (tx) => {
            const newProject = await tx
                .insert(schema_1.projects)
                .values({
                createdBy: userId,
                name,
                description,
            })
                .returning()
                .execute();
            const keys = this.generateProjectKeys();
            const newProjectKeys = await tx
                .insert(schema_1.projectKeys)
                .values({
                projectId: newProject[0].id,
                serverPublicKey: keys.serverPublicKey,
                serverPrivateKey: keys.serverPrivateKey,
                projectPublicKey: keys.projectPublicKey,
                projectPrivateKey: keys.projectPrivateKey,
            })
                .execute();
            const userOnProject = await tx
                .insert(schema_1.usersOnProjects)
                .values({
                userId: userId,
                projectId: newProject[0].id,
                role: 'owner',
                status: 'active',
            })
                .returning()
                .execute();
            const newRole = await tx
                .insert(schema_1.projectRoles)
                .values({
                projectId: newProject[0].id,
                projectRole: constants_1.DEAFULT_PROJECT_ROLE,
            })
                .returning()
                .execute();
            return { project: newProject[0], projectRole: newRole[0] };
        });
        return newRows;
    }
    async findAll() {
        const projectsList = await db_1.db.select().from(schema_1.projects).execute();
        return projectsList;
    }
    async findFlags(projectId, search, pageSize, pageNumber) {
        const offset = (pageNumber - 1) * pageSize;
        const conditions = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.projectId, projectId), (0, drizzle_orm_1.ilike)(schema_1.featureFlags.name, `%${search}%`));
        const combinedQuery = db_1.db
            .select({
            total: (0, drizzle_orm_1.sql) `COUNT(*) OVER()`,
            id: schema_1.featureFlags.id,
            projectId: schema_1.featureFlags.projectId,
            name: schema_1.featureFlags.name,
            isAdvanced: schema_1.featureFlags.isAdvanced,
            description: schema_1.featureFlags.description,
            createdAt: schema_1.featureFlags.createdAt,
            updatedAt: schema_1.featureFlags.updatedAt,
        })
            .from(schema_1.featureFlags)
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
    async createFlags(projectId, createFeatureFlagDto, userId) {
        const { name, description, isAdvanced } = createFeatureFlagDto;
        const flagKey = (0, utils_1.createKeyFromName)(name);
        const existigFlag = await db_1.db
            .select()
            .from(schema_1.featureFlags)
            .where((0, drizzle_orm_1.eq)(schema_1.featureFlags.flagKey, flagKey))
            .execute();
        if (existigFlag.length > 0) {
            throw new Error('Flag with this name already exists');
        }
        const newRows = await db_1.db.transaction(async (tx) => {
            const newFlag = await tx
                .insert(schema_1.featureFlags)
                .values({ projectId, name, description, isAdvanced, flagKey: flagKey })
                .returning()
                .execute();
            const projectRolesList = await tx
                .select()
                .from(schema_1.projectRoles)
                .where((0, drizzle_orm_1.eq)(schema_1.projectRoles.projectId, projectId))
                .execute();
            let flagValues = projectRolesList.map((role) => ({
                flagId: newFlag[0].id,
                value: false,
                roleId: role.id,
                projectRole: role.projectRole,
            }));
            if (!isAdvanced) {
                flagValues = flagValues.filter((role) => role.projectRole === constants_1.DEAFULT_PROJECT_ROLE);
            }
            const flagValue = await tx
                .insert(schema_1.featureFlagValues)
                .values(flagValues)
                .returning()
                .execute();
            const auditRecords = flagValue.map((value) => ({
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
            }));
            await tx.insert(schema_1.auditHistory).values(auditRecords).execute();
            await tx
                .insert(schema_1.auditHistory)
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
    async getProjectRoles(projectId) {
        const projectRolesList = await db_1.db
            .select()
            .from(schema_1.projectRoles)
            .where((0, drizzle_orm_1.eq)(schema_1.projectRoles.projectId, projectId))
            .execute();
        return projectRolesList;
    }
    async getFlagInfo(projectId, flagId) {
        const flagInfo = await db_1.db
            .select()
            .from(schema_1.featureFlags)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.projectId, projectId), (0, drizzle_orm_1.eq)(schema_1.featureFlags.id, flagId)))
            .execute();
        const flagValues = await db_1.db
            .select({
            id: schema_1.featureFlagValues.id,
            value: schema_1.featureFlagValues.value,
            roleId: schema_1.featureFlagValues.roleId,
            projectRoleName: schema_1.projectRoles.projectRole,
            flagId: schema_1.featureFlagValues.flagId,
        })
            .from(schema_1.featureFlagValues)
            .leftJoin(schema_1.projectRoles, (0, drizzle_orm_1.eq)(schema_1.featureFlagValues.roleId, schema_1.projectRoles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.featureFlagValues.flagId, flagId))
            .execute();
        if (!flagInfo[0].isAdvanced) {
            return {
                featureFlags: flagInfo[0],
                featureFlagValues: flagValues.filter((value) => value.projectRoleName === constants_1.DEAFULT_PROJECT_ROLE),
            };
        }
        return {
            featureFlags: flagInfo[0],
            featureFlagValues: flagValues,
        };
    }
    async createProjectRole(projectId, createProjectRoleDto) {
        const { name, description } = createProjectRoleDto;
        const newRows = await db_1.db.transaction(async (tx) => {
            const newProjectRole = await tx
                .insert(schema_1.projectRoles)
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
    async removeProjectRole(roleId) {
        const deletedRow = await db_1.db
            .delete(schema_1.projectRoles)
            .where((0, drizzle_orm_1.eq)(schema_1.projectRoles.id, roleId))
            .returning()
            .execute();
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
    async getProjectKeys(projectId) {
        const keys = await db_1.db
            .select()
            .from(schema_1.projectKeys)
            .where((0, drizzle_orm_1.eq)(schema_1.projectKeys.projectId, projectId))
            .execute();
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
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)()
], ProjectsService);
//# sourceMappingURL=projects.service.js.map