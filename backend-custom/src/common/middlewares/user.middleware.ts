import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { UserMock } from '@configs/app/dev-mocks';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const useCentralizeAuth = this.configService.get<boolean>(
      'appConfig.enableCentralizedAuthen',
    );

    if (!useCentralizeAuth) {
      next();
      return;
    }
    const isDevMode = this.configService.get('appConfig.nodeEnv') === 'local';

    req['user'] = isDevMode
      ? UserMock
      : {
          NhanVienID: this.unicodeReplaceRevert(req.header('X-UserID')),
          NhanVienGuid: req.header('X-UserGuid'),
          app: req.header('X-APP'),
          id: req.header('X-ContactId'),
          crm_key: process.env.MAIN_CRM_KEY,
        };
    // WARNING: this logic should be map from model
    req['user']['username'] = req['user']['NhanVienID'];
    
    // Set toketn user mock if they login
    if (req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(' ') ?? [];
      req['user']['token'] = type === 'JWT' ? token : req.headers.authorization;
    }
    next();
  }

  private unicodeReplaceRevert(value: string | undefined): string | undefined {
    if (value) {
      return value.replace(/-d/g, 'Đ');
    }
    return value;
  }


}
