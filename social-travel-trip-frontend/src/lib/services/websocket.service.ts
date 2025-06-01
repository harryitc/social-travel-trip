import { io, Socket } from 'socket.io-client';
import { environment } from '@/config/environment';
import { getAccessToken } from '@/features/auth/auth.service';
import { API_ENDPOINT } from '@/config/api.config';

// WebSocket event types
export enum WebsocketEvent {
  // Post events
  POST_CREATED = 'post:created',
  POST_UPDATED = 'post:updated',
  POST_DELETED = 'post:deleted',
  POST_LIKED = 'post:liked',
  POST_UNLIKED = 'post:unliked',

  // Comment events
  COMMENT_CREATED = 'comment:created',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',
  COMMENT_LIKED = 'comment:liked',
  COMMENT_UNLIKED = 'comment:unliked',

  // User events
  USER_FOLLOWED = 'user:followed',
  USER_UNFOLLOWED = 'user:unfollowed',

  // Notification events
  NOTIFICATION_CREATED = 'notification:created',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_DELETED = 'notification:deleted',

  // Group messaging events
  GROUP_MESSAGE_SENT = 'group:message:sent',
  GROUP_MESSAGE_LIKED = 'group:message:liked',
  GROUP_MESSAGE_UNLIKED = 'group:message:unliked',
  GROUP_MESSAGE_PINNED = 'group:message:pinned',
  GROUP_MESSAGE_UNPINNED = 'group:message:unpinned',

  // Group member events
  GROUP_MEMBER_JOINED = 'group:member:joined',
  GROUP_MEMBER_LEFT = 'group:member:left',
  GROUP_MEMBER_TYPING = 'group:member:typing',
  GROUP_MEMBER_STOP_TYPING = 'group:member:stop_typing',

  // Group events
  GROUP_UPDATED = 'group:updated',

  // User status events
  USER_TYPING = 'user:typing',
  USER_ONLINE = 'user:online',
}

// Event handler type
type EventHandler = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;

  /**
   * Initialize WebSocket connection
   */
  connect(): Promise<void> {
    console.log('WebSocket Service: Initializing connection...');
    const token = getAccessToken();

    console.log('WebSocket Service: Token from getAccessToken:', token ? `${token.substring(0, 20)}...` : 'null');

    // Allow connection without token for debugging
    if (!token) {
      console.warn('WebSocket Service: No authentication token available - connecting without auth for debugging');
    }

    console.log('WebSocket Service: Token available, checking connection state');

    if (this.socket?.connected) {
      console.log('WebSocket Service: Already connected, resolving');
      return Promise.resolve();
    }

    if (this.isConnecting) {
      console.log('WebSocket Service: Already connecting, resolving');
      return Promise.resolve();
    }

    console.log('WebSocket Service: Starting connection process');
    this.isConnecting = true;

    // Disconnect any existing socket
    if (this.socket) {
      console.log('WebSocket Service: Disconnecting existing socket');
      this.socket.disconnect();
      this.socket = null;
    }

    return new Promise((resolve, reject) => {
      try {
        const socketUrl = `${API_ENDPOINT.websocket || 'http://localhost:3000'}/social`;
        console.log('WebSocket Service: Connecting to', socketUrl);
        console.log('WebSocket Service: Using token:', token ? token.substring(0, 10) + '...' : 'none');

        // Create socket with detailed options
        const socketOptions: any = {
          reconnection: true, // Enable auto-reconnection for debugging
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 20000, // Increase timeout to 20 seconds
          transports: ['websocket', 'polling'],
          forceNew: true,
          autoConnect: true,
        };

        // Add auth only if token is available
        if (token) {
          socketOptions.extraHeaders = {
            Authorization: `Bearer ${token}`,
          };
          socketOptions.auth = {
            token: token, // Send token without Bearer prefix in auth object
          };
        }

        this.socket = io(socketUrl, socketOptions);

        // Log all socket events for debugging
        this.socket.onAny((event, ...args) => {
          console.log(`WebSocket Service: Received event "${event}"`, args);
        });

        this.socket.on('connect', () => {
          console.log('WebSocket Service: Successfully connected with ID:', this.socket?.id);
          this.reconnectAttempts = 0;
          this.isConnecting = false;

          // Register event handlers after successful connection
          console.log('WebSocket Service: Registering event handlers after connection...');
          this.registerEventHandlers();

          resolve();
        });

        this.socket.on('connection_established', (data) => {
          console.log('WebSocket Service: Connection established with server:', data);
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket Service: Connection error:', error);
          console.error('WebSocket Service: Error details:', JSON.stringify(error, null, 2));
          this.isConnecting = false;
          this.handleReconnect();
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.handleReconnect();
        });

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        });

        // Add more debug events
        this.socket.on('reconnect', (attemptNumber) => {
          console.log('WebSocket reconnected after', attemptNumber, 'attempts');
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
          console.log('WebSocket reconnect attempt', attemptNumber);
        });

        this.socket.on('reconnect_error', (error) => {
          console.error('WebSocket reconnect error:', error);
        });

        this.socket.on('reconnect_failed', () => {
          console.error('WebSocket reconnect failed - giving up');
        });

        // Event handlers will be registered after successful connection
      } catch (error) {
        this.isConnecting = false;
        console.error('Error initializing WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Handle reconnection
   */
  private handleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(() => {
          // Error handling is done in connect method
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Register event handlers
   */
  private registerEventHandlers(): void {
    if (!this.socket) {
      console.warn('WebSocket Service: Cannot register event handlers - socket not available');
      return;
    }

    console.log('WebSocket Service: Registering event handlers for', this.eventHandlers.size, 'events');

    // Register all event handlers
    this.eventHandlers.forEach((handlers, event) => {
      console.log(`WebSocket Service: Registering ${handlers.length} handlers for event "${event}"`);

      // Remove existing handlers first
      this.socket?.off(event);

      // Add new combined handler
      this.socket?.on(event, (data) => {
        console.log(`WebSocket Service: Event "${event}" received, calling ${handlers.length} handlers`, data);
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`WebSocket Service: Error in handler for event "${event}":`, error);
          }
        });
      });
    });
  }

  /**
   * Add event listener - supports both string and enum event types
   * @param event Event type (string or WebsocketEvent enum)
   * @param handler Event handler
   */
  on<K extends keyof typeof WebsocketEvent>(
    event: K | WebsocketEvent | string,
    handler: EventHandler
  ): void {
    const eventName = typeof event === 'string' ? event : WebsocketEvent[event as keyof typeof WebsocketEvent];

    console.log(`WebSocket Service: Adding handler for event "${eventName}" (original: "${event}")`);

    const handlers = this.eventHandlers.get(eventName) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventName, handlers);

    console.log(`WebSocket Service: Handler for "${eventName}" will be registered when connected`);
  }

  /**
   * Remove event listener - supports both string and enum event types
   * @param event Event type (string or WebsocketEvent enum)
   * @param handler Event handler
   */
  off<K extends keyof typeof WebsocketEvent>(
    event: K | WebsocketEvent | string,
    handler: EventHandler
  ): void {
    const eventName = typeof event === 'string' ? event : WebsocketEvent[event as keyof typeof WebsocketEvent];

    const handlers = this.eventHandlers.get(eventName) || [];
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
      this.eventHandlers.set(eventName, handlers);
    }

    // Remove handler if socket is connected
    if (this.socket?.connected) {
      this.socket.off(eventName, handler);
    }
  }

  /**
   * Emit event to server
   * @param event Event type
   * @param data Event data
   */
  emit(event: string, data: any): Promise<void> {
    console.log('WebSocket Service: Emitting event', event, data);

    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        try {
          // Add acknowledgment callback
          this.socket.emit(event, data, (response: any) => {
            console.log(`WebSocket Service: Server acknowledged ${event}:`, response);
            resolve();
          });
          console.log('WebSocket Service: Event emitted successfully');
        } catch (error) {
          console.error('WebSocket Service: Error emitting event:', error);
          reject(error);
        }
      } else {
        console.error('WebSocket Service: Cannot emit event - WebSocket not connected');

        // Try to reconnect and then emit
        this.connect()
          .then(() => {
            console.log('WebSocket Service: Reconnected, now emitting event');
            if (this.socket) {
              try {
                this.socket.emit(event, data, (response: any) => {
                  console.log(`WebSocket Service: Server acknowledged ${event} after reconnect:`, response);
                  resolve();
                });
              } catch (error) {
                console.error('WebSocket Service: Error emitting event after reconnect:', error);
                reject(error);
              }
            } else {
              reject(new Error('Socket still null after reconnect'));
            }
          })
          .catch(error => {
            console.error('WebSocket Service: Failed to reconnect:', error);
            reject(error);
          });
      }
    });
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get debug information about WebSocket state
   */
  getDebugInfo(): any {
    return {
      isConnected: this.socket?.connected || false,
      socketId: this.socket?.id || null,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      eventHandlersCount: this.eventHandlers.size,
      eventHandlers: Array.from(this.eventHandlers.keys()),
      socketUrl: `${API_ENDPOINT.websocket || 'http://localhost:3000'}/social`,
      hasToken: !!getAccessToken(),
    };
  }

  /**
   * Test WebSocket connection with simple ping
   */
  // testConnection(): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     if (!this.socket?.connected) {
  //       console.log('WebSocket Service: Not connected, attempting to connect...');
  //       this.connect()
  //         .then(() => {
  //           console.log('WebSocket Service: Connected successfully for test');
  //           resolve(true);
  //         })
  //         .catch((error) => {
  //           console.error('WebSocket Service: Connection test failed:', error);
  //           resolve(false);
  //         });
  //     } else {
  //       console.log('WebSocket Service: Already connected');
  //       resolve(true);
  //     }
  //   });
  // }

  // Group messaging methods
  /**
   * Join a group room
   * @param groupId Group ID to join
   */
  joinGroup(groupId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('group:join', { groupId });
      console.log(`WebSocket Service: Joined group ${groupId}`);
    } else {
      console.warn('WebSocket Service: Cannot join group - not connected');
    }
  }

  /**
   * Leave a group room
   * @param groupId Group ID to leave
   */
  leaveGroup(groupId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('group:leave', { groupId });
      console.log(`WebSocket Service: Left group ${groupId}`);
    } else {
      console.warn('WebSocket Service: Cannot leave group - not connected');
    }
  }

  /**
   * Send typing indicator
   * @param groupId Group ID
   * @param isTyping Whether user is typing or stopped typing
   */
  sendTyping(groupId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      const event = isTyping ? 'group:typing:start' : 'group:typing:stop';
      this.socket.emit(event, { groupId });
      console.log(`WebSocket Service: Sent typing ${isTyping ? 'start' : 'stop'} for group ${groupId}`);
    } else {
      console.warn('WebSocket Service: Cannot send typing indicator - not connected');
    }
  }


}

// Create singleton instance
export const websocketService = new WebSocketService();

export default websocketService;
