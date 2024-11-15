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
      req.auth.userId = '5f2d381a-1b5c-4bca-b49c-91d4074b050a';
    } else {
      if (!req.auth.userId) {
        return next(new UnauthorizedException());
      }
    }

    next();
  }
}
