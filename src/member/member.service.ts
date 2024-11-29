import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { usersOnProjects, users } from 'src/db/schema';
import { db } from 'src/db';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class MemberService {
  async create(
    createMemberDto: CreateMemberDto,
    projectId: string,
    InvitedUserId: string,
  ) {
    const { email } = createMemberDto;

    const newRows = await db.transaction(async (tx) => {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      let userId;

      if (existingUser.length === 0) {
        const newUser = await tx
          .insert(users)
          .values({
            email: email,
          })
          .returning()
          .execute();

        userId = newUser[0].id;
      } else {
        userId = existingUser[0].id;
      }

      const userOnProject = await tx
        .insert(usersOnProjects)
        .values({
          userId: userId,
          projectId: projectId,
          status: 'pending',
          invitedBy: InvitedUserId,
        })
        .returning()
        .execute();

      return { userOnProject: userOnProject };
    });
    return newRows;
  }

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async getAllMembersPerProject(
    projectId: string,
    search: string,
    pageSize: number,
    pageNumber: number,
  ) {
    const membersList = await db
      .select({
        total: sql`COUNT(*) OVER()`,
        id: usersOnProjects.id,
        joinedAt: usersOnProjects.joinedAt,
        userId: usersOnProjects.userId,
        projectId: usersOnProjects.projectId,
        invitedBy: usersOnProjects.invitedBy,
        role: usersOnProjects.role,
        status: usersOnProjects.status,
      })
      .from(usersOnProjects)
      .where(eq(usersOnProjects.projectId, projectId))
      .execute();

    const totalRecords =
      membersList.length > 0 ? Number(membersList[0].total) : 0;
    const memberList = membersList.map(({ total, ...rest }) => rest);

    return { totalRecords, memberList };
  }
}
