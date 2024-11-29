import { Injectable } from '@nestjs/common';
import { sign } from 'crypto';
import * as forge from 'node-forge';
import { db } from 'src/db';
import {
  featureFlags,
  featureFlagValues,
  projectKeys,
  projectRoles,
  projects,
} from 'src/db/schema';
import { and, eq, ilike, sql, or } from 'drizzle-orm';
import { DEAFULT_PROJECT_ROLE } from 'src/constants';

const RAS_ALGORITHM = 'RSA-OAEP';
export type FlagInfoRequest = {
  projectId: string;
  content: {
    userId?: number;
    userRole?: string;
  };
};
@Injectable()
export class ClientService {
  async encryptContent(projectId: string, jsonData: any) {
    // Fetch the keys from the database
    const keys = await db
      .select()
      .from(projectKeys)
      .where(eq(projectKeys.projectId, projectId))
      .execute();

    if (keys.length === 0) {
      throw new Error('No keys found for the given projectId');
    }

    // Extract the public key from the keys array
    const publicKeyPem = keys[0].serverPublicKey;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // Encrypt the content using the public key as UTF-8
    const content = JSON.stringify(jsonData.data.content);
    const encryptedContent = publicKey.encrypt(
      forge.util.encodeUtf8(content),
      'RSA-OAEP',
      {
        md: forge.md.sha256.create(),
      },
    );

    // Sign the encrypted content
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
    // Fetch the keys from the database
    console.time('fetchKeys');
    const keys = await db
      .select()
      .from(projectKeys)
      .where(eq(projectKeys.projectId, projectId))
      .execute();

    if (keys.length === 0) {
      throw new Error('No keys found for the given projectId');
    }

    // Extract the private key from the keys array
    const privateKeyPem = keys[0].serverPrivateKey;
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // Decode the Base64 encoded encrypted content and signature
    const encryptedContent = forge.util.decode64(encryptedContentBase64);
    const signature = forge.util.decode64(signatureBase64);

    // Decrypt the content using the private key
    const decryptedContent = privateKey.decrypt(encryptedContent, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });

    // // Extract the public key from the keys array
    const publicKeyPem = keys[0].projectPublicKey;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // // Verify the signature using the public key
    const isValid = publicKey.verify(
      forge.md.sha256
        .create()
        .update(encryptedContent, 'utf8')
        .digest()
        .bytes(),
      signature,
    );
    console.timeEnd('fetchKeys');

    return {
      decryptedContent: JSON.parse(forge.util.decodeUtf8(decryptedContent)),
      isValid,
    };
  }

  async getFlagsInfo(body: FlagInfoRequest) {
    console.log('🚀 ~ ClientService ~ getFlagsInfo ~ body:', body);
    const projectId = body.projectId;
    const role = body.content.userRole || DEAFULT_PROJECT_ROLE;

    console.time('fetchFlagInfo1');
    const flagInfo = await db
      .select({
        flagId: featureFlags.id,
        flagName: featureFlags.name,
        isAdvanced: featureFlags.isAdvanced,
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
    console.timeEnd('fetchFlagInfo1');
    console.log(flagInfo[0]);
    return flagInfo;
  }
}
