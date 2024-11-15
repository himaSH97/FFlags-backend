import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { db } from 'src/db';
import {
  projects,
  featureFlags,
  users,
  projectRoles,
  featureFlagValues,
} from 'src/db/schema';
import { and, count, eq, ilike, is, like, sql } from 'drizzle-orm';
import { Doc } from 'src/db/types';
import { DEAFULT_PROJECT_ROLE } from 'src/constants';

@Injectable()
export class ProjectsService {
  async create(createProjectDto: CreateProjectDto, userId: string) {
    /**
     * Create a new Project in the database.
     * Add a new Default Role for the Project.
     * Return the created project.
     */

    const { name, description } = createProjectDto;

    const newRows = await db.transaction(async (tx) => {
      const newProject = await tx
        .insert(projects)
        .values({ createdBy: userId, name, description })
        .returning()
        .execute();
      const newRole = await tx
        .insert(projectRoles)
        .values({
          projectId: newProject[0].id,
          projectRole: DEAFULT_PROJECT_ROLE,
        })
        .returning()
        .execute();

      return { project: newProject[0], projectRole: newRole[0] };
    });

    return newRows;
  }

  async findAll(): Promise<Doc<'projects'>[]> {
    const projectsList = await db.select().from(projects).execute();
    return projectsList;
  }

  async findFlags(
    projectId: string,
    search: string,
    pageSize: number,
    pageNumber: number,
  ) {
    const offset = (pageNumber - 1) * pageSize;
    const conditions = and(
      eq(featureFlags.projectId, projectId),
      ilike(featureFlags.name, `%${search}%`),
    );

    const combinedQuery = db
      .select({
        total: sql`COUNT(*) OVER()`,
        id: featureFlags.id,
        projectId: featureFlags.projectId,
        name: featureFlags.name,
        isAdvanced: featureFlags.isAdvanced,
        description: featureFlags.description,
        createdAt: featureFlags.createdAt,
        updatedAt: featureFlags.updatedAt,
      })
      .from(featureFlags)
      .where(conditions)
      .limit(Number(pageSize))
      .offset(Number(offset));

    const result = await combinedQuery.execute();
    const totalRecords = result.length > 0 ? Number(result[0].total) : 0;
    const flagsList = result.map(({ total, ...rest }) => rest);
    return {
      totalRecords,
      flagsList,
    };
  }

  async createFlags(projectId: string, createFeatureFlagDto: any) {
    const { name, description, isAdvanced } = createFeatureFlagDto;
    const newRows = await db.transaction(async (tx) => {
      const newFlag = await tx
        .insert(featureFlags)
        .values({ projectId, name, description, isAdvanced })
        .returning()
        .execute();

      const projectRolesList = await tx
        .select()
        .from(projectRoles)
        .where(eq(projectRoles.projectId, projectId))
        .execute();

      let flagValues = projectRolesList.map((role) => ({
        flagId: newFlag[0].id,
        value: false, // Set the value as needed
        roleId: role.id,
        projectRole: role.projectRole,
      }));

      if (!isAdvanced) {
        flagValues = flagValues.filter(
          (role) => role.projectRole === DEAFULT_PROJECT_ROLE,
        );
      }

      const flagValue = await tx
        .insert(featureFlagValues)
        .values(flagValues)
        .returning()
        .execute();
      console.log('🚀 ~ ProjectsService ~ newRows ~ flagValue:', flagValue);
      return { flag: newFlag[0], flagValue };
    });
    return newRows;
  }

  async getProjectRoles(projectId: string) {
    const projectRolesList = await db
      .select()
      .from(projectRoles)
      .where(eq(projectRoles.projectId, projectId))
      .execute();
    return projectRolesList;
  }

  async createProjectRoles(projectId: string, createProjectRolesDto: any) {
    const { projectRole, description } = createProjectRolesDto;

    const newRows = await db.transaction(async (tx) => {
      const newProjectRole = await tx
        .insert(projectRoles)
        .values({ projectId: projectId, projectRole, description })
        .returning()
        .execute();

      return { projectRole: newProjectRole[0] };
    });

    return newRows;
  }

  findOne(projectId: string) {
    return `This action returns a #${projectId} project`;
  }

  update(projectId: string, updateProjectDto: UpdateProjectDto) {
    return `This action upprojectId${projectId} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
