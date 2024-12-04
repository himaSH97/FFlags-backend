import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RequestWithAuthSystemInfo } from 'src/types';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(request: RequestWithAuthSystemInfo, createProjectDto: CreateProjectDto): Promise<{
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
    findAll(request: Request): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdBy: string;
    }[]>;
    findFlags(id: string, search?: string, pageSize?: number, pageNumber?: number): Promise<{
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
    getFlag(id: string, flagId: string): Promise<{
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
    createFlags(id: string, createFeatureFlagDto: any, request: RequestWithAuthSystemInfo): Promise<{
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
    getProjectRoles(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        projectRole: string;
    }[]>;
    createProjectRole(id: string, createProjectRoleDto: CreateRoleDto): Promise<{
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
    getProjectKeys(id: string, request: RequestWithAuthSystemInfo): Promise<{
        id: number;
        value: string;
        name: string;
    }[]>;
}
