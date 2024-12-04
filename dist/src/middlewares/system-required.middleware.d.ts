import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import 'dotenv/config';
import { RequestWithAuthSystemInfo } from 'src/types';
export declare class SystemRequiredMiddleware implements NestMiddleware {
    use(req: RequestWithAuthSystemInfo, res: Response, next: NextFunction): Promise<void>;
}
