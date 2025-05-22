import { io, Socket } from 'socket.io-client';
import { environment } from '@/config/environment';
import { getAccessToken } from '@/features/auth/auth.service';

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
    const token = getAccessToken();

    if (!token) {
      return Promise.reject(new Error('No authentication token available'));
    }

    if (this.socket?.connected || this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(`${environment.apiUrl || 'http://localhost:3000'}/social`, {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
          reconnection: false, // We'll handle reconnection manually
          timeout: 10000, // 10 seconds
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
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

        // Register event handlers
        this.registerEventHandlers();
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
    if (!this.socket) return;

    // Register all event handlers
    this.eventHandlers.forEach((handlers, event) => {
      this.socket?.off(event); // Remove existing handlers
      this.socket?.on(event, (data) => {
        handlers.forEach(handler => handler(data));
      });
    });
  }

  /**
   * Add event listener
   * @param event Event type
   * @param handler Event handler
   */
  on(event: WebsocketEvent, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);

    // Register handler if socket is connected
    if (this.socket?.connected) {
      this.socket.on(event, handler);
    }
  }

  /**
   * Remove event listener
   * @param event Event type
   * @param handler Event handler
   */
  off(event: WebsocketEvent, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
      this.eventHandlers.set(event, handlers);
    }

    // Remove handler if socket is connected
    if (this.socket?.connected) {
      this.socket.off(event, handler);
    }
  }

  /**
   * Emit event to server
   * @param event Event type
   * @param data Event data
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.error('Cannot emit event: WebSocket not connected');
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

export default websocketService;
