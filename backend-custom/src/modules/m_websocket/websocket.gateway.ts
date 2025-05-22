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
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/social',
  transports: ['websocket', 'polling'],
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
    this.logger.debug('WebSocket Gateway initialized');
    this.logger.debug('WebSocket server is listening on namespace: /social');

    // Log when a new socket connects to the server
    server.on('connection', (socket) => {
      this.logger.log(`New socket connected: ${socket.id}`);
    });
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client attempting to connect: ${client.id}`);
    this.logger.log(
      `Client handshake headers: ${JSON.stringify(client.handshake.headers)}`,
    );

    try {
      const token = this.extractTokenFromHeader(client);
      if (!token) {
        this.logger.error(`No token provided for client: ${client.id}`);
        this.disconnect(client, 'Unauthorized: No token provided');
        return;
      }

      this.logger.log(`Token extracted for client: ${client.id}`);

      try {
        // Sử dụng hardcoded JWT Secret giống như trong Auth module
        const jwtSecret = 'CAK_HARRYITC';
        this.logger.log(`Using hardcoded JWT_SECRET`);

        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtSecret,
        });

        this.logger.debug(
          `Token verified for client: ${client.id}, payload: ${JSON.stringify(payload)}`,
        );

        // Store user information in socket
        client.data.user = payload;

        // Join user to their personal room
        client.join(`user-${payload.sub}`);

        this.logger.log(
          `Client connected: ${client.id}, User ID: ${payload.sub}`,
        );

        // Send a welcome message to the client
        client.emit('connection_established', {
          message: 'Successfully connected to WebSocket server',
          userId: payload.sub,
        });
      } catch (error) {
        this.logger.error(
          `Token verification failed for client: ${client.id}, error: ${error.message}`,
        );
        this.disconnect(client, 'Unauthorized: Invalid token');
      }
    } catch (error) {
      this.logger.error(
        `Internal server error for client: ${client.id}, error: ${error.message}`,
      );
      this.disconnect(client, 'Internal server error');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Log user ID if available
    if (client.data && client.data.user) {
      this.logger.log(`User ${client.data.user.sub} disconnected`);
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const { authorization } = client.handshake.headers;
    const authToken = client.handshake.auth?.token;

    this.logger.log(`Authorization header: ${authorization || 'not provided'}`);
    this.logger.log(`Auth token: ${authToken || 'not provided'}`);

    // Try to get token from authorization header first
    if (authorization) {
      const [type, token] = authorization.split(' ');
      this.logger.log(`Auth type: ${type}, Token exists: ${!!token}`);

      if (type === 'Bearer' && token) {
        return token;
      }
    }

    // Try to get token from auth object
    if (authToken) {
      if (authToken.startsWith('Bearer ')) {
        const token = authToken.substring(7); // Remove 'Bearer ' prefix
        this.logger.log(`Token extracted from auth object: ${!!token}`);
        return token;
      }
    }

    this.logger.error(
      'No valid token found in authorization header or auth object',
    );
    return undefined;
  }

  private disconnect(client: Socket, message: string) {
    this.logger.error(`Disconnecting client ${client.id}: ${message}`);

    try {
      // Send error message to client
      client.emit('error', new WsException(message));

      // Disconnect the client
      client.disconnect();

      this.logger.log(`Client ${client.id} disconnected successfully`);
    } catch (error) {
      this.logger.error(
        `Error disconnecting client ${client.id}: ${error.message}`,
      );
    }
  }

  // Event handlers for different actions
  @SubscribeMessage('post:create')
  handlePostCreate(client: Socket, payload: any) {
    this.logger.log(`Post created by user ${client.data.user.sub}`);
    // Broadcast to all clients
    this.server.emit('post:created', payload);
    return { event: 'post:created', data: payload };
  }

  // Handle post:created event directly
  @SubscribeMessage('post:created')
  handlePostCreated(client: Socket, payload: any) {
    this.logger.log(
      `Post created event received from user ${client.data?.user?.sub || 'unknown'}`,
    );
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    try {
      // Broadcast to all clients except sender
      this.logger.log('Broadcasting post:created event to all clients');
      client.broadcast.emit('post:created', payload);

      // Also broadcast to all clients using server
      this.logger.log('Broadcasting post:created event using server.emit');
      this.server.emit('post:created', payload);

      return { event: 'post:created', data: payload };
    } catch (error) {
      this.logger.error(
        `Error broadcasting post:created event: ${error.message}`,
      );
      return { event: 'error', data: { message: 'Failed to broadcast event' } };
    }
  }

  @SubscribeMessage('post:like')
  handlePostLike(client: Socket, payload: any) {
    this.logger.log(`Post liked by user ${client.data.user.sub}`);
    // Broadcast to all clients
    this.server.emit('post:liked', payload);
    return { event: 'post:liked', data: payload };
  }

  // Handle post:liked event directly
  @SubscribeMessage('post:liked')
  handlePostLiked(client: Socket, payload: any) {
    this.logger.log(
      `Post liked event received from user ${client.data.user.sub}`,
    );
    // Broadcast to all clients except sender
    client.broadcast.emit('post:liked', payload);
    return { event: 'post:liked', data: payload };
  }

  @SubscribeMessage('post:comment')
  handlePostComment(client: Socket, payload: any) {
    this.logger.log(`Comment added by user ${client.data.user.sub}`);
    // Broadcast to all clients
    this.server.emit('comment:created', payload);
    return { event: 'comment:created', data: payload };
  }

  // Handle comment:created event directly
  @SubscribeMessage('comment:created')
  handleCommentCreated(client: Socket, payload: any) {
    this.logger.log(
      `Comment created event received from user ${client.data.user.sub}`,
    );
    // Broadcast to all clients except sender
    client.broadcast.emit('comment:created', payload);
    return { event: 'comment:created', data: payload };
  }

  @SubscribeMessage('user:follow')
  handleUserFollow(client: Socket, payload: any) {
    this.logger.log(`User ${client.data.user.sub} followed another user`);
    // Broadcast to all clients
    this.server.emit('user:followed', payload);
    return { event: 'user:followed', data: payload };
  }

  // Handle user:followed event directly
  @SubscribeMessage('user:followed')
  handleUserFollowed(client: Socket, payload: any) {
    this.logger.log(
      `User followed event received from user ${client.data.user.sub}`,
    );
    // Broadcast to all clients except sender
    client.broadcast.emit('user:followed', payload);
    return { event: 'user:followed', data: payload };
  }
}
