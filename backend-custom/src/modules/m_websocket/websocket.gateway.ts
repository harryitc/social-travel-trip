import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
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
    this.logger.debug('🚀 WebSocket Gateway initialized');
    this.logger.debug('🚀 WebSocket server is listening on namespace: /social');
    this.logger.debug('🚀 Server instance:', !!server);
    this.logger.debug(
      '🚀 CORS configuration: origin=*, methods=[GET,POST], credentials=true',
    );

    // Log when a new socket connects to the server
    server.on('connection', (socket) => {
      this.logger.debug(`🔌 New socket connected to server: ${socket.id}`);
    });

    // Log server events
    server.on('error', (error) => {
      this.logger.error('🚨 Server error:', error);
    });

    // // Log namespace events
    // const socialNamespace = server.of('/social');
    // socialNamespace.on('connection', (socket) => {
    //   this.logger.debug(
    //     `🔌 New socket connected to /social namespace: ${socket.id}`,
    //   );
    // });

    // this.logger.debug('🚀 WebSocket Gateway setup complete');
  }

  async handleConnection(client: Socket) {
    this.logger.debug(`🔌 Client attempting to connect: ${client.id}`);
    this.logger.debug(`🔍 Client IP: ${client.handshake.address}`);
    this.logger.debug(
      `🔍 Client headers:`,
      JSON.stringify(client.handshake.headers, null, 2),
    );
    this.logger.debug(
      `🔍 Client auth:`,
      JSON.stringify(client.handshake.auth, null, 2),
    );
    this.logger.debug(
      `🔍 Client query:`,
      JSON.stringify(client.handshake.query, null, 2),
    );

    try {
      const token = this.extractTokenFromHeader(client);
      if (!token) {
        this.logger.warn(`No token provided for client: ${client.id} - allowing connection for debugging`);

        // For debugging: allow connection without token
        client.data.user = { sub: 'anonymous', username: 'anonymous' };
        client.join(`user-anonymous`);

        this.logger.debug(`Anonymous client connected: ${client.id}`);

        client.emit('connection_established', {
          message: 'Connected without authentication (debug mode)',
          userId: 'anonymous',
        });
        return;
      }

      this.logger.debug(`Token extracted for client: ${client.id}`);

      try {
        // Sử dụng hardcoded JWT Secret giống như trong Auth module
        const jwtSecret = 'CAK_HARRYITC';
        this.logger.debug(`Using hardcoded JWT_SECRET`);

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

        this.logger.debug(
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
    this.logger.debug(`Client disconnected: ${client.id}`);

    // Log user ID if available
    if (client.data && client.data.user) {
      this.logger.debug(`User ${client.data.user.sub} disconnected`);
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const { authorization } = client.handshake.headers;
    const authToken = client.handshake.auth?.token;

    this.logger.debug(`Authorization header: ${authorization || 'not provided'}`);
    this.logger.debug(`Auth token: ${authToken || 'not provided'}`);
    this.logger.debug(
      `Full handshake auth:`,
      JSON.stringify(client.handshake.auth),
    );

    // Try to get token from authorization header first
    if (authorization) {
      const [type, token] = authorization.split(' ');
      this.logger.debug(`Auth type: ${type}, Token exists: ${!!token}`);

      if (type == 'Bearer' && token) {
        this.logger.debug(`Token extracted from authorization header`);
        return token;
      }
    }

    // Try to get token from auth object (without Bearer prefix)
    if (authToken) {
      // If token has Bearer prefix, remove it
      if (authToken.startsWith('Bearer ')) {
        const token = authToken.substring(7);
        this.logger.debug(
          `Token extracted from auth object (with Bearer prefix removed)`,
        );
        return token;
      } else {
        // Token without Bearer prefix
        this.logger.debug(`Token extracted from auth object (no Bearer prefix)`);
        return authToken;
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

      this.logger.debug(`Client ${client.id} disconnected successfully`);
    } catch (error) {
      this.logger.error(
        `Error disconnecting client ${client.id}: ${error.message}`,
      );
    }
  }

  // Group room management
  @SubscribeMessage('group:join')
  handleJoinGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user?.sub;
      if (!userId) {
        this.logger.error(
          `User not authenticated for group join: ${client.id}`,
        );
        return;
      }

      const roomName = `group-${data.groupId}`;
      client.join(roomName);

      this.logger.debug(
        `User ${userId} joined group room ${roomName} (socket: ${client.id})`,
      );

      // Notify other group members that user is online
      client.to(roomName).emit('user:online', {
        userId,
        isOnline: true,
      });
    } catch (error) {
      this.logger.error(
        `Error joining group ${data.groupId}: ${error.message}`,
      );
    }
  }

  @SubscribeMessage('group:leave')
  handleLeaveGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user?.sub;
      if (!userId) {
        this.logger.error(
          `User not authenticated for group leave: ${client.id}`,
        );
        return;
      }

      const roomName = `group-${data.groupId}`;

      // Notify other group members that user is offline
      client.to(roomName).emit('user:online', {
        userId,
        isOnline: false,
      });

      client.leave(roomName);

      this.logger.debug(
        `User ${userId} left group room ${roomName} (socket: ${client.id})`,
      );
    } catch (error) {
      this.logger.error(
        `Error leaving group ${data.groupId}: ${error.message}`,
      );
    }
  }

  // Typing indicators
  @SubscribeMessage('group:typing:start')
  handleStartTyping(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user?.sub;
      if (!userId) {
        this.logger.error(
          `User not authenticated for typing start: ${client.id}`,
        );
        return;
      }

      const roomName = `group-${data.groupId}`;

      // Notify other group members that user is typing
      client.to(roomName).emit('user:typing', {
        groupId: data.groupId,
        userId,
        isTyping: true,
      });

      this.logger.debug(
        `User ${userId} started typing in group ${data.groupId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error handling typing start in group ${data.groupId}: ${error.message}`,
      );
    }
  }

  @SubscribeMessage('group:typing:stop')
  handleStopTyping(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user?.sub;
      if (!userId) {
        this.logger.error(
          `User not authenticated for typing stop: ${client.id}`,
        );
        return;
      }

      const roomName = `group-${data.groupId}`;

      // Notify other group members that user stopped typing
      client.to(roomName).emit('user:typing', {
        groupId: data.groupId,
        userId,
        isTyping: false,
      });

      this.logger.debug(
        `User ${userId} stopped typing in group ${data.groupId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error handling typing stop in group ${data.groupId}: ${error.message}`,
      );
    }
  }

  // WebSocket Gateway now handles group room management and typing indicators
  // All other events are emitted by server-side services after API operations
}
