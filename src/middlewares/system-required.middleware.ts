import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { users, usersOnProjects } from 'src/db/schema';
import { RequestWithAuthSystemInfo } from 'src/types';

@Injectable()
export class SystemRequiredMiddleware implements NestMiddleware {
  async use(req: RequestWithAuthSystemInfo, res: Response, next: NextFunction) {
    if (!req.auth.userId) {
      return next(new UnauthorizedException());
    }
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.userId, req.auth.userId))
      .execute();

    const systemUserId = user[0].id;

    if (!systemUserId) {
      return next(new UnauthorizedException('System User not found'));
    }

    const projectList = await db
      .select({
        projectId: usersOnProjects.projectId,
      })
      .from(usersOnProjects)
      .where(eq(usersOnProjects.userId, systemUserId))
      .execute();

    const accessAllowed = projectList.map((project) => project.projectId);

    const systemRequired = {
      projects: accessAllowed,
      userId: user[0].id,
    };

    req.systemInfo = systemRequired;

    next();
  }
}
