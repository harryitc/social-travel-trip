import { io, Socket } from 'socket.io-client';
import { getAccessToken, logoutService } from '@/features/auth/auth.service';
import { API_ENDPOINT } from '@/config/api.config';
import { isWindow } from '@/lib/utils/windows.util';
import websocketMonitor, { WebSocketMonitorError } from './websocket-monitor.service';

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

// WebSocket error types
export enum WebSocketErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RECONNECTION_FAILED = 'RECONNECTION_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
}

// WebSocket error interface
export interface WebSocketError {
  type: WebSocketErrorType;
  message: string;
  originalError?: any;
  shouldLogout?: boolean;
  shouldReconnect?: boolean;
}

class WebSocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private errorHandlers: Map<WebSocketErrorType, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private lastAuthError: Date | null = null;

  /**
   * Initialize WebSocket connection
   */
  connect(): Promise<void> {
    const token = getAccessToken();

    // Check if already connected
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    if (this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    // Disconnect any existing socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    return new Promise((resolve, reject) => {
      try {
        const socketUrl = `${API_ENDPOINT.websocket || 'http://localhost:3000'}/social`;

        // Create socket with options
        const socketOptions: any = {
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 20000,
          transports: ['websocket', 'polling'],
          forceNew: true,
          autoConnect: true,
        };

        // Add auth if token is available
        if (token) {
          socketOptions.extraHeaders = {
            Authorization: `Bearer ${token}`,
          };
          socketOptions.auth = {
            token: token,
          };
        }

        this.socket = io(socketUrl, socketOptions);

        this.socket.on('connect', () => {
          this.reconnectAttempts = 0;
          this.isConnecting = false;

          // Record connection in monitor
          websocketMonitor.onConnected(this.socket?.id || 'unknown');

          // Register event handlers after successful connection
          this.registerEventHandlers();

          resolve();
        });

        this.socket.on('connection_established', () => {
          // Connection fully established with server
        });

        this.socket.on('connect_error', (error) => {
          this.isConnecting = false;

          // Parse and handle error
          const wsError = this.parseConnectionError(error);
          this.handleWebSocketError(wsError);

          if (wsError.shouldReconnect && !wsError.shouldLogout) {
            this.handleReconnect();
          }

          reject(wsError);
        });

        this.socket.on('disconnect', (reason) => {
          websocketMonitor.onDisconnected(reason);
          this.handleReconnect();
        });

        this.socket.on('error', (error) => {
          const wsError = this.parseConnectionError(error);
          this.handleWebSocketError(wsError);
          reject(wsError);
        });

        // Reconnection events
        this.socket.on('reconnect', () => {
          websocketMonitor.onConnected(this.socket?.id || 'unknown');
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
          websocketMonitor.onReconnectAttempt(attemptNumber);
        });

        this.socket.on('reconnect_error', (error) => {
          const wsError = this.parseConnectionError(error);
          this.handleWebSocketError(wsError);
        });

        this.socket.on('reconnect_failed', () => {
          const error: WebSocketMonitorError = {
            type: 'CONNECTION',
            message: 'Reconnection failed after maximum attempts',
            timestamp: new Date(),
          };
          websocketMonitor.onError(error);
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

      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(() => {
          // Error handling is done in connect method
        });
      }, this.reconnectInterval);
    } else {
      const error: WebSocketMonitorError = {
        type: 'CONNECTION',
        message: 'Không thể kết nối lại WebSocket sau nhiều lần thử',
        timestamp: new Date(),
      };
      websocketMonitor.onError(error);
    }
  }

  /**
   * Parse connection error to determine error type
   */
  private parseConnectionError(error: any): WebSocketError {
    const errorMessage = error?.message || error?.description || 'Unknown connection error';

    // Check for authentication errors
    if (errorMessage.includes('Unauthorized') ||
        errorMessage.includes('Invalid token') ||
        errorMessage.includes('Authentication failed') ||
        error?.type === 'UnauthorizedError') {
      return {
        type: WebSocketErrorType.AUTHENTICATION_ERROR,
        message: 'Phiên đăng nhập đã hết hạn',
        originalError: error,
        shouldLogout: true,
        shouldReconnect: false,
      };
    }

    // Check for token expired errors
    if (errorMessage.includes('Token expired') ||
        errorMessage.includes('jwt expired')) {
      return {
        type: WebSocketErrorType.TOKEN_EXPIRED,
        message: 'Token đã hết hạn',
        originalError: error,
        shouldLogout: true,
        shouldReconnect: false,
      };
    }

    // Check for network errors
    if (errorMessage.includes('Network') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('timeout')) {
      return {
        type: WebSocketErrorType.NETWORK_ERROR,
        message: 'Lỗi kết nối mạng',
        originalError: error,
        shouldLogout: false,
        shouldReconnect: true,
      };
    }

    // Default to connection error
    return {
      type: WebSocketErrorType.CONNECTION_ERROR,
      message: 'Lỗi kết nối WebSocket',
      originalError: error,
      shouldLogout: false,
      shouldReconnect: true,
    };
  }

  /**
   * Handle WebSocket errors
   */
  private handleWebSocketError(wsError: WebSocketError): void {
    // Convert to monitor error format
    const monitorError: WebSocketMonitorError = {
      type: this.getMonitorErrorType(wsError.type),
      message: wsError.message,
      timestamp: new Date(),
      details: wsError.originalError,
    };

    // Record error in monitor
    websocketMonitor.onError(monitorError);

    // Handle authentication errors - logout user
    if (wsError.shouldLogout && isWindow()) {
      // Prevent multiple logout attempts
      const now = new Date();
      if (this.lastAuthError && (now.getTime() - this.lastAuthError.getTime()) < 5000) {
        return;
      }

      this.lastAuthError = now;

      // Disconnect WebSocket before logout
      this.disconnect();

      // Logout after a short delay
      setTimeout(() => {
        logoutService();
      }, 1000);
    }

    // Emit error event to registered handlers
    this.emitErrorEvent(wsError);
  }

  /**
   * Convert WebSocket error type to monitor error type
   */
  private getMonitorErrorType(wsErrorType: WebSocketErrorType): 'CONNECTION' | 'AUTHENTICATION' | 'NETWORK' | 'EVENT' | 'SERVER' {
    switch (wsErrorType) {
      case WebSocketErrorType.AUTHENTICATION_ERROR:
      case WebSocketErrorType.TOKEN_EXPIRED:
      case WebSocketErrorType.UNAUTHORIZED:
        return 'AUTHENTICATION';
      case WebSocketErrorType.NETWORK_ERROR:
        return 'NETWORK';
      case WebSocketErrorType.CONNECTION_ERROR:
      case WebSocketErrorType.RECONNECTION_FAILED:
        return 'CONNECTION';
      default:
        return 'SERVER';
    }
  }

  /**
   * Emit error event to registered error handlers
   */
  private emitErrorEvent(wsError: WebSocketError): void {
    const handlers = this.errorHandlers.get(wsError.type) || [];
    handlers.forEach(handler => {
      try {
        handler(wsError);
      } catch (error) {
        console.error(`Error in WebSocket error handler for ${wsError.type}:`, error);
      }
    });

    // Also emit to general error handlers
    const generalHandlers = this.errorHandlers.get(WebSocketErrorType.SERVER_ERROR) || [];
    generalHandlers.forEach(handler => {
      try {
        handler(wsError);
      } catch (error) {
        console.error('Error in general WebSocket error handler:', error);
      }
    });
  }

  /**
   * Register event handlers
   */
  private registerEventHandlers(): void {
    if (!this.socket) {
      return;
    }

    // Register all event handlers
    this.eventHandlers.forEach((handlers, event) => {
      // Remove existing handlers first
      this.socket?.off(event);

      // Add new combined handler
      this.socket?.on(event, (data) => {
        handlers.forEach(handler => {
          try {
            handler(data);
            websocketMonitor.onEventSuccess(event);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Handler execution failed';
            websocketMonitor.onEventFailure(event, errorMessage);
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

    const handlers = this.eventHandlers.get(eventName) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventName, handlers);

    // Re-register handlers if socket is connected
    if (this.socket?.connected) {
      this.registerEventHandlers();
    }
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
    const startTime = Date.now();

    // Track event attempt
    websocketMonitor.onEventAttempt(event);

    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        try {
          // Add acknowledgment callback
          this.socket.emit(event, data, () => {
            const responseTime = Date.now() - startTime;
            websocketMonitor.onEventSuccess(event, responseTime);
            resolve();
          });
        } catch (error) {
          websocketMonitor.onEventFailure(event, error instanceof Error ? error.message : 'Unknown error');
          reject(error);
        }
      } else {
        // Try to reconnect and then emit
        this.connect()
          .then(() => {
            if (this.socket) {
              try {
                this.socket.emit(event, data, () => {
                  const responseTime = Date.now() - startTime;
                  websocketMonitor.onEventSuccess(event, responseTime);
                  resolve();
                });
              } catch (error) {
                websocketMonitor.onEventFailure(event, error instanceof Error ? error.message : 'Unknown error');
                reject(error);
              }
            } else {
              websocketMonitor.onEventFailure(event, 'Socket null after reconnect');
              reject(new Error('Socket still null after reconnect'));
            }
          })
          .catch(error => {
            websocketMonitor.onEventFailure(event, error instanceof Error ? error.message : 'Failed to reconnect');
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
   * Register error handler
   * @param errorType Error type to handle
   * @param handler Error handler function
   */
  onError(errorType: WebSocketErrorType, handler: (error: WebSocketError) => void): void {
    if (!this.errorHandlers.has(errorType)) {
      this.errorHandlers.set(errorType, []);
    }
    this.errorHandlers.get(errorType)!.push(handler);
  }

  /**
   * Remove error handler
   * @param errorType Error type
   * @param handler Error handler function
   */
  offError(errorType: WebSocketErrorType, handler: (error: WebSocketError) => void): void {
    const handlers = this.errorHandlers.get(errorType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Get last authentication error timestamp
   */
  getLastAuthError(): Date | null {
    return this.lastAuthError;
  }

  /**
   * Get WebSocket monitoring statistics
   */
  getMonitorStats() {
    return websocketMonitor.getStats();
  }

  /**
   * Get connection summary
   */
  getConnectionSummary(): string {
    return websocketMonitor.getConnectionSummary();
  }

  /**
   * Get events summary
   */
  getEventsSummary() {
    return websocketMonitor.getEventsSummary();
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit?: number) {
    return websocketMonitor.getRecentErrors(limit);
  }

  /**
   * Set monitor log level
   */
  setLogLevel(level: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'): void {
    websocketMonitor.setLogLevel(level);
  }

  /**
   * Clear monitoring statistics
   */
  clearMonitorStats(): void {
    websocketMonitor.clearStats();
  }

  /**
   * Export monitoring stats as JSON
   */
  exportMonitorStats(): string {
    return websocketMonitor.exportStats();
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
    }
  }

  /**
   * Leave a group room
   * @param groupId Group ID to leave
   */
  leaveGroup(groupId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('group:leave', { groupId });
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
    }
  }


}

// Create singleton instance
export const websocketService = new WebSocketService();

export default websocketService;
