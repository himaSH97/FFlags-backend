import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as forge from 'node-forge';
import { db } from 'src/db';
import {
  featureFlags,
  featureFlagValues,
  projectKeys,
  projectRoles,
  projects,
} from 'src/db/schema';
import { and, eq, ilike, sql, or, inArray } from 'drizzle-orm';
import { DEAFULT_PROJECT_ROLE } from 'src/constants';
import { GetFlagDto } from './dto/get-flag.dto';

const RSA_ALGORITHM = 'RSA-OAEP';
export type FlagInfoRequest = {
  projectId: string;
  content: {
    userId?: number;
    userRole?: string;
  };
  data: {
    encryptedContent: string;
    signature: string;
  };
};
@Injectable()
export class ClientService {
  async encryptContent(projectId: string, jsonData: any) {
    const keys = await db
      .select()
      .from(projectKeys)
      .where(eq(projectKeys.projectId, projectId))
      .execute();

    if (keys.length === 0) {
      throw new Error('No keys found for the given projectId');
    }

    const publicKeyPem = keys[0].serverPublicKey;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const content = JSON.stringify(jsonData.content);
    const encryptedContent = publicKey.encrypt(
      forge.util.encodeUtf8(content),
      RSA_ALGORITHM,
      {
        md: forge.md.sha256.create(),
      },
    );

    const privateKeyPem = keys[0].projectPrivateKey;
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const signature = privateKey.sign(
      forge.md.sha256.create().update(encryptedContent, 'utf8'),
    );

    return {
      encryptedContent: forge.util.encode64(encryptedContent),
      signature: forge.util.encode64(signature),
    };
  }

  async decryptContent(
    projectId: string,
    encryptedContentBase64: string,
    signatureBase64: string,
  ) {
    const keys = await db
      .select()
      .from(projectKeys)
      .where(eq(projectKeys.projectId, projectId))
      .execute();

    if (keys.length === 0) {
      throw new Error('No keys found for the given projectId');
    }

    const privateKeyPem = keys[0].serverPrivateKey;
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    const encryptedContent = forge.util.decode64(encryptedContentBase64);
    const signature = forge.util.decode64(signatureBase64);

    const decryptedContent = privateKey.decrypt(
      encryptedContent,
      RSA_ALGORITHM,
      {
        md: forge.md.sha256.create(),
      },
    );

    const publicKeyPem = keys[0].projectPublicKey;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    const isValid = publicKey.verify(
      forge.md.sha256
        .create()
        .update(encryptedContent, 'utf8')
        .digest()
        .bytes(),
      signature,
    );

    return {
      values: JSON.parse(forge.util.decodeUtf8(decryptedContent)),
      isValid,
    };
  }

  async getFlagsInfo(projectId: string, data: { ec: string; s: string }) {
    const decryptedContent = await this.decryptContent(
      projectId,
      data.ec,
      data.s,
    );

    const role = decryptedContent.values.userRole || DEAFULT_PROJECT_ROLE;

    const flagInfo = await db
      .select({
        flagId: featureFlags.id,
        flagName: featureFlags.name,
        isAdvanced: featureFlags.isAdvanced,
        flagKey: featureFlags.flagKey,
        flagValues: sql`json_agg(json_build_object(
          'id', feature_flag_values.id,
          'value', feature_flag_values.value,
          'roleName', project_roles.project_role
        ))`.as('flag_values'),
      })
      .from(featureFlags)
      .innerJoin(
        featureFlagValues,
        eq(featureFlags.id, featureFlagValues.flagId),
      )
      .innerJoin(projectRoles, eq(featureFlagValues.roleId, projectRoles.id))
      .where(
        and(
          eq(featureFlags.projectId, projectId),
          or(
            and(
              eq(featureFlags.isAdvanced, false),
              eq(projectRoles.projectRole, DEAFULT_PROJECT_ROLE),
            ),
            and(
              eq(featureFlags.isAdvanced, true),
              eq(projectRoles.projectRole, role),
            ),
          ),
        ),
      )
      .groupBy(featureFlags.id)
      .execute();
    return flagInfo;
  }

  async getFlagInfo(projectId: string, body: GetFlagDto) {
    const decryptedContent = await this.decryptContent(
      projectId,
      body.data['ec'],
      body.data['s'],
    );

    const role = decryptedContent.values.userRole || DEAFULT_PROJECT_ROLE;
    const flagKey = decryptedContent.values.flagKey;

    const flagInfo = await db
      .select({
        flagId: featureFlags.id,
        flagName: featureFlags.name,
        isAdvanced: featureFlags.isAdvanced,
        flagKey: featureFlags.flagKey,
        flagValues: sql`json_agg(json_build_object(
          'id', feature_flag_values.id,
          'value', feature_flag_values.value,
          'roleName', project_roles.project_role
        ))`.as('flag_values'),
      })
      .from(featureFlags)
      .innerJoin(
        featureFlagValues,
        eq(featureFlags.id, featureFlagValues.flagId),
      )
      .innerJoin(projectRoles, eq(featureFlagValues.roleId, projectRoles.id))
      .where(
        and(
          eq(featureFlags.projectId, projectId),
          eq(featureFlags.flagKey, flagKey),
          or(
            and(
              eq(featureFlags.isAdvanced, false),
              eq(projectRoles.projectRole, DEAFULT_PROJECT_ROLE),
            ),
            and(
              eq(featureFlags.isAdvanced, true),
              eq(projectRoles.projectRole, role),
            ),
          ),
        ),
      )
      .groupBy(featureFlags.id)
      .execute();

    return flagInfo;
  }

  async getFlagsInfoV2(projectId: string, body: any) {
    //for this flag keys should be an array of strings
    const decryptedContent = await this.decryptContent(
      projectId,
      body.ec,
      body.s,
    );

    const role = decryptedContent.values.userRole || DEAFULT_PROJECT_ROLE;
    const flagKeyArray = decryptedContent.values.flagKeys;

    const flagInfo = await db
      .select({
        flagId: featureFlags.id,
        flagName: featureFlags.name,
        isAdvanced: featureFlags.isAdvanced,
        flagKey: featureFlags.flagKey,
        flagValues: sql`json_agg(json_build_object(
          'id', feature_flag_values.id,
          'value', feature_flag_values.value,
          'roleName', project_roles.project_role
        ))`.as('flag_values'),
      })
      .from(featureFlags)
      .innerJoin(
        featureFlagValues,
        eq(featureFlags.id, featureFlagValues.flagId),
      )
      .innerJoin(projectRoles, eq(featureFlagValues.roleId, projectRoles.id))
      .where(
        and(
          eq(featureFlags.projectId, projectId),
          inArray(featureFlags.flagKey, flagKeyArray),
          or(
            and(
              eq(featureFlags.isAdvanced, false),
              eq(projectRoles.projectRole, DEAFULT_PROJECT_ROLE),
            ),
            and(
              eq(featureFlags.isAdvanced, true),
              eq(projectRoles.projectRole, role),
            ),
          ),
        ),
      )
      .groupBy(featureFlags.id)
      .execute();

    if (flagInfo.length === 0) {
      throw new HttpException(
        'No flags found for the given flag keys',
        HttpStatus.NOT_FOUND,
      );
    }

    return flagInfo;
  }
}
