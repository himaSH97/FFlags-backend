import { ExpressRequestWithAuth, verifyToken, getAuth } from '@clerk/express';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import 'dotenv/config';
import { NextFunction, Response } from 'express';

@Injectable()
export class LegacyRequireAuthMiddleware implements NestMiddleware {
  async use(req: ExpressRequestWithAuth, res: Response, next: NextFunction) {
    if (process.env.APP_ENV === 'LOCAL') {
      req.auth.userId = process.env.LOCAL_USER_ID as string;
    } else {
      if (!req.auth.userId) {
        const clerkAuthObject = getAuth(req);
        if (!clerkAuthObject) {
          return next(new UnauthorizedException());
        }
        req.auth = clerkAuthObject;
      }
    }
    next();
  }
}
