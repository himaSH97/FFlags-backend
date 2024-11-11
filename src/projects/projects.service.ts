import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { db } from 'src/db';
import { projects, featureFlags, users, projectRoles } from 'src/db/schema';
import { and, count, eq, ilike, like, sql } from 'drizzle-orm';
import { Doc } from 'src/db/types';

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
        .values({ projectId: newProject[0].id, projectRole: 'DEFAULT' })
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
        value: featureFlags.value,
        description: featureFlags.description,
        createdAt: featureFlags.createdAt,
        updatedAt: featureFlags.updatedAt,
      })
      .from(featureFlags)
      .where(conditions)
      .limit(Number(pageSize))
      .offset(Number(offset));

    const result = await combinedQuery.execute();
    const total = result.length > 0 ? Number(result[0].total) : 0;
    const totalPages = Math.ceil(total / pageSize);
    const flagsList = result.map(({ total, ...rest }) => rest);
    return {
      totalPages,
      flagsList,
    };
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
