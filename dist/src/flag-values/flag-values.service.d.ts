export declare class FlagValuesService {
    updateFlagValue(id: string, userId: string, updateFlagValueDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        flagId: string;
        roleId: string;
        value: boolean;
        visibilityLevel: number;
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
