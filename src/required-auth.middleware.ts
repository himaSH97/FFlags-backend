import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

type RequestWithAuth = Request & { auth: { userId: string } };

@Injectable()
export class LegacyRequireAuthMiddleware implements NestMiddleware {
  use(req: RequestWithAuth, res: Response, next: NextFunction) {
    if (!req.auth?.userId) {
      return next(new UnauthorizedException());
    }
    next();
  }
}
