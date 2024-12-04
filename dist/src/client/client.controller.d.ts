import { ClientService } from './client.service';
import { GetFlagDto } from './dto/get-flag.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    encryptContent(projectId: string, jsonData: any): Promise<{
        encryptedContent: string;
        signature: string;
    }>;
    decryptContent(projectId: string, encryptedContent: string, signature: string): Promise<{
        values: any;
        isValid: boolean;
    }>;
    getFlagq(body: GetFlagDto, req: any): Promise<{
        flagId: string;
        flagName: string;
        isAdvanced: boolean;
        flagKey: string;
        flagValues: unknown;
    }[]>;
    getFlag(body: GetFlagDto, req: any): Promise<{
        flagId: string;
        flagName: string;
        isAdvanced: boolean;
        flagKey: string;
        flagValues: unknown;
    }[]>;
}
