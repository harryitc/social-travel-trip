import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict this to your frontend domain
  },
  namespace: '/social',
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketGateway.name);
  
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly websocketService: WebsocketService,
  ) {}

  afterInit(server: Server) {
    this.websocketService.setServer(server);
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromHeader(client);
      if (!token) {
        this.disconnect(client, 'Unauthorized: No token provided');
        return;
      }

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        // Store user information in socket
        client.data.user = payload;
        
        // Join user to their personal room
        client.join(`user-${payload.sub}`);
        
        this.logger.log(`Client connected: ${client.id}, User ID: ${payload.sub}`);
      } catch (error) {
        this.disconnect(client, 'Unauthorized: Invalid token');
      }
    } catch (error) {
      this.disconnect(client, 'Internal server error');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const { authorization } = client.handshake.headers;
    if (!authorization) return undefined;
    
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private disconnect(client: Socket, message: string) {
    this.logger.error(`Disconnecting client: ${message}`);
    client.emit('error', new WsException(message));
    client.disconnect();
  }

  // Event handlers for different actions
  @SubscribeMessage('post:create')
  handlePostCreate(client: Socket, payload: any) {
    this.logger.log(`Post created by user ${client.data.user.sub}`);
    // Logic will be implemented in service
    return { event: 'post:created', data: payload };
  }

  @SubscribeMessage('post:like')
  handlePostLike(client: Socket, payload: any) {
    this.logger.log(`Post liked by user ${client.data.user.sub}`);
    // Logic will be implemented in service
    return { event: 'post:liked', data: payload };
  }

  @SubscribeMessage('post:comment')
  handlePostComment(client: Socket, payload: any) {
    this.logger.log(`Comment added by user ${client.data.user.sub}`);
    // Logic will be implemented in service
    return { event: 'post:commented', data: payload };
  }

  @SubscribeMessage('user:follow')
  handleUserFollow(client: Socket, payload: any) {
    this.logger.log(`User ${client.data.user.sub} followed another user`);
    // Logic will be implemented in service
    return { event: 'user:followed', data: payload };
  }
}
