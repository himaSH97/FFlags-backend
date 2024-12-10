import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/db';
import { projects, users, usersOnProjects } from 'src/db/schema';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@Injectable()
export class InviteService {
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

  async inviteResponse(updateInviteDto: any) {
    const action = updateInviteDto.action === 'accept' ? 'active' : 'declined';
    await db
      .update(usersOnProjects)
      .set({
        status: action,
        joinedAt: new Date(),
      })
      .where(eq(usersOnProjects.id, updateInviteDto.inviteId))
      .execute();
    return { message: 'Invite accepted successfully' };
  }

  async inviteCount(userId: string) {
    const invites = await this.findAll(userId);
    return { count: invites.length };
  }
}
