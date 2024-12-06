import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import 'dotenv/config';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/db';
import { users, usersOnProjects } from 'src/db/schema';
import { RequestWithAuthSystemInfo } from 'src/types';
import {
  FFPermissions,
  TFFPermissions,
  TUserPermissions,
} from 'src/permissions';

@Injectable()
export class SystemRequiredMiddleware implements NestMiddleware {
  async use(req: RequestWithAuthSystemInfo, res: Response, next: NextFunction) {
    if (!req.auth.sub) {
      return next(new UnauthorizedException());
    }
    const user = await db
      .select({ id: users.id, clerkUserId: users.clerkUserId })
      .from(users)
      .where(eq(users.clerkUserId, req.auth.sub))
      .execute();

    const systemUserId = user[0].id;
    const systemUserClerkId = user[0].clerkUserId;

    if (!systemUserId && !systemUserClerkId) {
      return next(new UnauthorizedException('Valid system User not found'));
    }

    const projectList = await db
      .select({
        projectId: usersOnProjects.projectId,
        role: usersOnProjects.role,
      })
      .from(usersOnProjects)
      .where(
        and(
          eq(usersOnProjects.userId, systemUserId),
          eq(usersOnProjects.status, 'active'),
        ),
      )
      .execute();

    const accessAllowed = projectList.map((project) => project.projectId);
    const systemPermissions: Record<string, TUserPermissions> = {};

    accessAllowed.forEach((projectId) => {
      const project = projectList.find(
        (project) => project.projectId === projectId,
      );
      if (!project) return;
      systemPermissions[project.projectId] = FFPermissions[project.role];
    });

    const systemRequired = {
      projects: accessAllowed,
      userId: user[0].id,
      clerkUserId: user[0].clerkUserId,
      systemPermissions,
    };

    req.systemInfo = systemRequired;

    next();
  }
}
