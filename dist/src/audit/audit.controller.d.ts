import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditHistoryPerFlag(flagId: string, search?: string, pageSize?: number, pageNumber?: number): Promise<{
        id: string;
        entityId: string;
        entityType: "feature_flags" | "feature_flag_values";
        entityAction: "create" | "update" | "delete";
        changedAt: Date;
        changedBy: string;
        changedFields: unknown;
        metadata: {
            id: string | null;
            email: string | null;
            userId: string | null;
            auditRecordId: string;
            roleName: string | null;
        };
    }[]>;
    getAuditHistoryPerFlagValueId(flagValueId: string): Promise<{
        id: string;
        entityId: string;
        entityType: "feature_flags" | "feature_flag_values";
        entityAction: "create" | "update" | "delete";
        changedFields: unknown;
        changedBy: string;
        changedAt: Date;
    }[]>;
}
