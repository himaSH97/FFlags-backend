import { FlagValuesService } from './flag-values.service';
import { RequestWithAuthSystemInfo } from 'src/types';
export declare class FlagValuesController {
    private readonly flagValuesService;
    constructor(flagValuesService: FlagValuesService);
    updateFlagValue(flagValueId: string, updateFlagValueDto: any, req: RequestWithAuthSystemInfo): Promise<{
        id: string;
        flagId: string;
        roleId: string;
        value: boolean;
        visibilityLevel: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    addFlagValue(flagValueId: string, createFlagValueDto: any, req: RequestWithAuthSystemInfo): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        flagId: string;
        roleId: string;
        value: boolean;
        visibilityLevel: number;
    }[]>;
}
