import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';
import 'dotenv/config';
export declare class LegacyRequireAuthMiddleware implements NestMiddleware {
    use(req: ExpressRequestWithAuth, res: Response, next: NextFunction): void;
}
