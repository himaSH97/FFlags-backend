import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';

@Injectable()
export class LegacyRequireAuthMiddleware implements NestMiddleware {
  use(req: ExpressRequestWithAuth, res: Response, next: NextFunction) {
    if (!req.auth.userId) {
      return next(new UnauthorizedException());
    }

    next();
  }
}
