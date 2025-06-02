import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

/**
 * Request từ client, trước khi vào trong sẽ chạy qua đây.
 * Có thể save data log để kiểm soát được số lượng client và mật độ người dùng sử dụng hệ thống.
 */
@Injectable()
export class CustomHeaderMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction): void {
    const apiVersion = this.configService.get('appConfig.apiVersionHeader');

    if (!apiVersion) {
      throw new Error(`Missing API_VERSION_HEADER in environment config`);
    }

    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version');
    res.setHeader('X-Api-Version', apiVersion);

    next();
  }
}
