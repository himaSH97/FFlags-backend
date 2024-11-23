import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { usersOnProjects } from 'src/db/schema';
import { db } from 'src/db';
import { eq, sql } from 'drizzle-orm';
import { stat } from 'fs';

@Injectable()
export class MemberService {
  create(createMemberDto: CreateMemberDto) {
    return 'This action adds a new member';
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
