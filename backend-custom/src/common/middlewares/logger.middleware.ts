import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Request từ client, trước khi vào trong sẽ chạy qua đây.
 * Có thể save data log để kiểm soát được số lượng client và mật độ người dùng sử dụng hệ thống.
 */
@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, path: url } = req;
    const { statusCode } = res;
    this.logger.log(`${ip}: ${method} ${req.baseUrl} - ${statusCode}: ${url}`);
    next();
  }
}
