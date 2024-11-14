// src/middleware/logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const {
      method,
      originalUrl,
      headers: { 'user-agent': userAgent },
    } = req;
    const ip = req.ip;

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode}  - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
