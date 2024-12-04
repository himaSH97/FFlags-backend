import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { usersOnProjects, users, roleEnum } from 'src/db/schema';
import { db } from 'src/db';
import { and, eq, ilike, sql } from 'drizzle-orm';

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
          role: 'viewer',
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
    rolesArray: string[],
    pageSize: number,
    pageNumber: number,
  ) {
    const offset = (pageNumber - 1) * pageSize;
    const conditionsArray = [
      eq(usersOnProjects.projectId, projectId),
      ilike(users.email, `%${search}%`),
    ];

    const conditions = and(...conditionsArray);

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
        platformStatus: users.clerkUserId,
        email: users.email,
      })
      .from(usersOnProjects)
      .innerJoin(users, eq(usersOnProjects.userId, users.id))
      .where(conditions)
      .limit(Number(pageSize))
      .offset(Number(offset))
      .execute();

    const totalRecords =
      membersList.length > 0 ? Number(membersList[0].total) : 0;
    const memberList = membersList.map(
      ({ total, platformStatus, ...rest }) => ({
        ...rest,
        platformStatus: platformStatus ? 'complete' : 'pending',
      }),
    );

    return { totalRecords, memberList };
  }
}
