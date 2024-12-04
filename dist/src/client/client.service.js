"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const forge = require("node-forge");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const constants_1 = require("../constants");
const RSA_ALGORITHM = 'RSA-OAEP';
let ClientService = class ClientService {
    async encryptContent(projectId, jsonData) {
        const keys = await db_1.db
            .select()
            .from(schema_1.projectKeys)
            .where((0, drizzle_orm_1.eq)(schema_1.projectKeys.projectId, projectId))
            .execute();
        if (keys.length === 0) {
            throw new Error('No keys found for the given projectId');
        }
        const publicKeyPem = keys[0].serverPublicKey;
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const content = JSON.stringify(jsonData.content);
        const encryptedContent = publicKey.encrypt(forge.util.encodeUtf8(content), RSA_ALGORITHM, {
            md: forge.md.sha256.create(),
        });
        const privateKeyPem = keys[0].projectPrivateKey;
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const signature = privateKey.sign(forge.md.sha256.create().update(encryptedContent, 'utf8'));
        return {
            encryptedContent: forge.util.encode64(encryptedContent),
            signature: forge.util.encode64(signature),
        };
    }
    async decryptContent(projectId, encryptedContentBase64, signatureBase64) {
        const keys = await db_1.db
            .select()
            .from(schema_1.projectKeys)
            .where((0, drizzle_orm_1.eq)(schema_1.projectKeys.projectId, projectId))
            .execute();
        if (keys.length === 0) {
            throw new Error('No keys found for the given projectId');
        }
        const privateKeyPem = keys[0].serverPrivateKey;
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const encryptedContent = forge.util.decode64(encryptedContentBase64);
        const signature = forge.util.decode64(signatureBase64);
        const decryptedContent = privateKey.decrypt(encryptedContent, RSA_ALGORITHM, {
            md: forge.md.sha256.create(),
        });
        const publicKeyPem = keys[0].projectPublicKey;
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const isValid = publicKey.verify(forge.md.sha256
            .create()
            .update(encryptedContent, 'utf8')
            .digest()
            .bytes(), signature);
        return {
            values: JSON.parse(forge.util.decodeUtf8(decryptedContent)),
            isValid,
        };
    }
    async getFlagsInfo(projectId, body) {
        const decryptedContent = await this.decryptContent(projectId, body.data['ec'], body.data['s']);
        const role = decryptedContent.values.userRole || constants_1.DEAFULT_PROJECT_ROLE;
        const flagInfo = await db_1.db
            .select({
            flagId: schema_1.featureFlags.id,
            flagName: schema_1.featureFlags.name,
            isAdvanced: schema_1.featureFlags.isAdvanced,
            flagKey: schema_1.featureFlags.flagKey,
            flagValues: (0, drizzle_orm_1.sql) `json_agg(json_build_object(
          'id', feature_flag_values.id,
          'value', feature_flag_values.value,
          'roleName', project_roles.project_role
        ))`.as('flag_values'),
        })
            .from(schema_1.featureFlags)
            .innerJoin(schema_1.featureFlagValues, (0, drizzle_orm_1.eq)(schema_1.featureFlags.id, schema_1.featureFlagValues.flagId))
            .innerJoin(schema_1.projectRoles, (0, drizzle_orm_1.eq)(schema_1.featureFlagValues.roleId, schema_1.projectRoles.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.projectId, projectId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.isAdvanced, false), (0, drizzle_orm_1.eq)(schema_1.projectRoles.projectRole, constants_1.DEAFULT_PROJECT_ROLE)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.isAdvanced, true), (0, drizzle_orm_1.eq)(schema_1.projectRoles.projectRole, role)))))
            .groupBy(schema_1.featureFlags.id)
            .execute();
        console.timeEnd('fetchFlagInfo');
        console.log(flagInfo[0]);
        return flagInfo;
    }
    async getFlagInfo(projectId, body) {
        const decryptedContent = await this.decryptContent(projectId, body.data['ec'], body.data['s']);
        const role = decryptedContent.values.userRole || constants_1.DEAFULT_PROJECT_ROLE;
        const flagKey = decryptedContent.values.flagKey;
        const flagInfo = await db_1.db
            .select({
            flagId: schema_1.featureFlags.id,
            flagName: schema_1.featureFlags.name,
            isAdvanced: schema_1.featureFlags.isAdvanced,
            flagKey: schema_1.featureFlags.flagKey,
            flagValues: (0, drizzle_orm_1.sql) `json_agg(json_build_object(
          'id', feature_flag_values.id,
          'value', feature_flag_values.value,
          'roleName', project_roles.project_role
        ))`.as('flag_values'),
        })
            .from(schema_1.featureFlags)
            .innerJoin(schema_1.featureFlagValues, (0, drizzle_orm_1.eq)(schema_1.featureFlags.id, schema_1.featureFlagValues.flagId))
            .innerJoin(schema_1.projectRoles, (0, drizzle_orm_1.eq)(schema_1.featureFlagValues.roleId, schema_1.projectRoles.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.projectId, projectId), (0, drizzle_orm_1.eq)(schema_1.featureFlags.flagKey, flagKey), (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.isAdvanced, false), (0, drizzle_orm_1.eq)(schema_1.projectRoles.projectRole, constants_1.DEAFULT_PROJECT_ROLE)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.featureFlags.isAdvanced, true), (0, drizzle_orm_1.eq)(schema_1.projectRoles.projectRole, role)))))
            .groupBy(schema_1.featureFlags.id)
            .execute();
        return flagInfo;
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)()
], ClientService);
//# sourceMappingURL=client.service.js.map