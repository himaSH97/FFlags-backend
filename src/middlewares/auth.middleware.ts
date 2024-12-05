import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';
import 'dotenv/config';

@Injectable()
export class LegacyRequireAuthMiddleware implements NestMiddleware {
  use(req: ExpressRequestWithAuth, res: Response, next: NextFunction) {
    if (process.env.APP_ENV === 'LOCAL') {
      req.auth.userId = process.env.LOCAL_USER_ID as string;
    } else {
      if (!req.auth.userId) {
        console.error('Unauthorized request', req);
        console.error('Auth', req.auth);
        return next(new UnauthorizedException());
      }
    }
    console.log('req.auth.userId', req.auth.userId);
    next();
  }
}
