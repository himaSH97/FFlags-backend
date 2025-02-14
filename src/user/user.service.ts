import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { users, usersOnProjects } from 'src/db/schema';
import { eq, and } from 'drizzle-orm';
import { permission } from 'process';
import { FFPermissions } from 'src/permissions';

@Injectable()
export class UserService {
  async getRoles(id: string) {
    const userRoles = await db
      .select()
      .from(usersOnProjects)
      .where(and(eq(usersOnProjects.userId, id), eq(usersOnProjects.status, 'active')))
      .execute();
    return userRoles;
  }
}
