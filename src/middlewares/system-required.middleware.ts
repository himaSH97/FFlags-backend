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
import { clerkClient } from '@clerk/express';

@Injectable()
export class SystemRequiredMiddleware implements NestMiddleware {
  async use(req: RequestWithAuthSystemInfo, res: Response, next: NextFunction) {
    if (!req.auth.userId) {
      return next(new UnauthorizedException());
    }
    const user = await db
      .select({ id: users.id, clerkUserId: users.clerkUserId })
      .from(users)
      .where(eq(users.clerkUserId, req.auth.userId))
      .execute();

    /**
     * remove when webhook is implemented
     *--------------------------------------------------------------------------------------------------------------
     */

    if (user.length === 0) {
      const uppstreamUser = await clerkClient.users.getUser(req.auth.userId);
      if (uppstreamUser) {
        const email = uppstreamUser.emailAddresses[0].emailAddress;

        const existingUnverifiedUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .execute();

        if (existingUnverifiedUser.length > 0) {
          const updatedUser = await db
            .update(users)
            .set({ clerkUserId: req.auth.userId })
            .where(eq(users.email, email))
            .returning({ id: users.id, clerkUserId: users.clerkUserId })
            .execute();
          user.push(updatedUser[0]);
        } else {
          const newUser = await db
            .insert(users)
            .values({
              email: email,
              clerkUserId: req.auth.userId,
            })
            .returning({
              id: users.id,
              clerkUserId: users.clerkUserId,
            })
            .execute();
          user.push(newUser[0]);
        }
      }
    }

    /**
     *--------------------------------------------------------------------------------------------------------------
     */

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
