import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [
    WebsocketGateway,
    WebsocketService,
  ],
  exports: [
    WebsocketService,
  ],
})
export class WebsocketModule {}
