import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: 'CAK_HARRYITC', // nên dùng .env
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
  ],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
