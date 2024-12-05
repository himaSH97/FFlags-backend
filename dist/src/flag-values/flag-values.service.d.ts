export declare class FlagValuesService {
    updateFlagValue(id: string, userId: string, updateFlagValueDto: any): Promise<{
        id: string;
        flagId: string;
        roleId: string;
        value: boolean;
        visibilityLevel: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createFlagValue(id: string, userId: string, createFlagValueDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        flagId: string;
        roleId: string;
        value: boolean;
        visibilityLevel: number;
    }[]>;
}
