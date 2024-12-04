import { GetFlagDto } from './dto/get-flag.dto';
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
export declare class ClientService {
    encryptContent(projectId: string, jsonData: any): Promise<{
        encryptedContent: string;
        signature: string;
    }>;
    decryptContent(projectId: string, encryptedContentBase64: string, signatureBase64: string): Promise<{
        values: any;
        isValid: boolean;
    }>;
    getFlagsInfo(projectId: string, body: GetFlagDto): Promise<{
        flagId: string;
        flagName: string;
        isAdvanced: boolean;
        flagKey: string;
        flagValues: unknown;
    }[]>;
    getFlagInfo(projectId: string, body: GetFlagDto): Promise<{
        flagId: string;
        flagName: string;
        isAdvanced: boolean;
        flagKey: string;
        flagValues: unknown;
    }[]>;
}
