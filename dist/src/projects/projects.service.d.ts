import { Doc } from 'src/db/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateRoleDto } from './dto/create-role.dto';
export declare class ProjectsService {
    create(createProjectDto: CreateProjectDto, userId: string): Promise<{
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            createdBy: string;
        };
        projectRole: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            projectId: string;
            projectRole: string;
        };
    }>;
    findAll(): Promise<Doc<'projects'>[]>;
    findFlags(projectId: string, search: string, pageSize: number, pageNumber: number): Promise<{
        totalRecords: number;
        flagsList: {
            id: string;
            projectId: string;
            name: string;
            isAdvanced: boolean;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createFlags(projectId: string, createFeatureFlagDto: any, userId: string): Promise<{
        flag: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            projectId: string;
            flagKey: string;
            isAdvanced: boolean;
        };
        flagValue: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            flagId: string;
            roleId: string;
            value: boolean;
            visibilityLevel: number;
        }[];
    }>;
    getProjectRoles(projectId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        projectRole: string;
    }[]>;
    getFlagInfo(projectId: string, flagId: string): Promise<{
        featureFlags: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            projectId: string;
            flagKey: string;
            isAdvanced: boolean;
        };
        featureFlagValues: {
            id: string;
            value: boolean;
            roleId: string;
            projectRoleName: string | null;
            flagId: string;
        }[];
    }>;
    createProjectRole(projectId: string, createProjectRoleDto: CreateRoleDto): Promise<{
        projectRole: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            projectId: string;
            projectRole: string;
        };
    }>;
    removeProjectRole(roleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        projectRole: string;
    }[]>;
    generateProjectKeys(): {
        serverPublicKey: string;
        serverPrivateKey: string;
        projectPublicKey: string;
        projectPrivateKey: string;
    };
    getProjectKeys(projectId: string): Promise<{
        id: number;
        value: string;
        name: string;
    }[]>;
}
