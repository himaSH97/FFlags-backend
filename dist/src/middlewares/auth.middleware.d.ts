import { NestMiddleware } from '@nestjs/common';
import 'dotenv/config';
import { NextFunction, Response } from 'express';
import { RequestWithAuth } from 'src/types';
export declare class LegacyRequireAuthMiddleware implements NestMiddleware {
    use(req: RequestWithAuth, res: Response, next: NextFunction): Promise<void>;
}
