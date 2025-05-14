import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

import { ClerkClient, verifyToken } from '@clerk/backend';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const useCentralizeAuth = this.configService.get<boolean>(
      'appConfig.enableCentralizedAuthen',
    );

    if (!useCentralizeAuth) {
      next();
      return;
    }

    req['user'] = {};
    // const isDevMode = this.configService.get('appConfig.nodeEnv') === 'local';

    // req['user'] = isDevMode
    //   ? UserMock
    //   : {
    //       user_id: this.unicodeReplaceRevert(req.header('X-UserID')),
    //       username: req.header('X-UserGuid'),
    //     };
    // WARNING: this logic should be map from model
    // req['user']['username'] = req['user']['user_id'];

    // Set toketn user mock if they login
    if (req.headers.authorization) {
      // const [type, token] = req.headers.authorization.split(' ') ?? [];
      // req['user']['token'] = type === 'JWT' ? token : req.headers.authorization;
      const token = req.headers.authorization.split(' ')[1];

      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      });

      const user = await this.clerkClient.users.getUser(tokenPayload.sub);
      req['user'] = user;
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
