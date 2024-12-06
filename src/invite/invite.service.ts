import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/db';
import { projects, users, usersOnProjects } from 'src/db/schema';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@Injectable()
export class InviteService {
  create(createInviteDto: CreateInviteDto) {
    return 'This action adds a new invite';
  }

  async findAll(userId: string) {
    const projectInvites = await db
      .select({
        id: usersOnProjects.id,
        projectId: projects.id,
        projectName: projects.name,
        invitedBy: users.email,
        invitedById: users.id,
        userId: usersOnProjects.userId,
        role: usersOnProjects.role,
      })
      .from(usersOnProjects)
      .where(
        and(
          eq(usersOnProjects.userId, userId),
          eq(usersOnProjects.status, 'pending'),
        ),
      )
      .leftJoin(projects, eq(usersOnProjects.projectId, projects.id))
      .leftJoin(users, eq(usersOnProjects.invitedBy, users.id))
      .execute();
    return projectInvites;
  }

  findOne(id: number) {
    return `This action returns a #${id} invite`;
  }

  update(id: number, updateInviteDto: UpdateInviteDto) {
    return `This action updates a #${id} invite`;
  }

  remove(id: number) {
    return `This action removes a #${id} invite`;
  }
}
