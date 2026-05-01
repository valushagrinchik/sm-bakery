import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function performanceMiddleware(req: Request, res: Response, next: NextFunction): void {
  const logger = new Logger('PerformanceMiddleware');
  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || '';

  // Log request start
  logger.log(`[${method}] ${url} - ${ip} - ${userAgent}`);

  // Override res.end to log response time
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const { statusCode } = res;

    // Log completion
    logger.log(
      `[${method}] ${url} - ${statusCode} - ${responseTime}ms - ${ip}`,
    );

    // Log slow requests
    if (responseTime > 1000) {
      logger.warn(
        `Slow request detected: [${method}] ${url} - ${responseTime}ms`,
      );
    }

    // Call original end and return its result
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
}
