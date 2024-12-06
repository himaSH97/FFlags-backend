import { verifyToken } from '@clerk/express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import 'dotenv/config';
import { NextFunction, Response } from 'express';
import { RequestWithAuth } from 'src/types';

@Injectable()
export class LegacyRequireAuthMiddleware implements NestMiddleware {
  async use(req: RequestWithAuth, res: Response, next: NextFunction) {
    if (process.env.APP_ENV === 'LOCAL') {
      req.auth.sub = process.env.LOCAL_USER_ID as string;
    } else {
      const authToken = req.headers.authorization?.split(' ')[1] || '';
      const verifiedInfo = await verifyToken(authToken, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      req.auth = verifiedInfo;
      console.log(
        '🚀 ~ LegacyRequireAuthMiddleware ~ use ~ req.auth.sub:',
        req.auth.sub,
      );
      if (!req.auth.sub) {
        return next(new UnauthorizedException());
      }
    }
    next();
  }
}
