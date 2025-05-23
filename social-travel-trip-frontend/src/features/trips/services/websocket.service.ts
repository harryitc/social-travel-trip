import { io, Socket } from 'socket.io-client';
import { TripGroupMessage } from './trip-group.service';

export interface WebSocketEvents {
  // Message events
  'message:new': (data: { groupId: string; message: TripGroupMessage }) => void;
  'message:like': (data: { messageId: number; likeCount: number; userId: number }) => void;
  'message:pin': (data: { messageId: number; groupId: string; isPinned: boolean }) => void;
  
  // Group events
  'group:member_joined': (data: { groupId: string; member: any }) => void;
  'group:member_left': (data: { groupId: string; userId: number }) => void;
  'group:updated': (data: { groupId: string; updates: any }) => void;
  
  // User events
  'user:typing': (data: { groupId: string; userId: number; isTyping: boolean }) => void;
  'user:online': (data: { userId: number; isOnline: boolean }) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const token = localStorage.getItem('auth_token');
      
      this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        upgrade: true,
        rememberUpgrade: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      this.handleReconnect();
    });

    // Setup message event listeners
    this.socket.on('message:new', (data) => {
      this.emit('message:new', data);
    });

    this.socket.on('message:like', (data) => {
      this.emit('message:like', data);
    });

    this.socket.on('message:pin', (data) => {
      this.emit('message:pin', data);
    });

    // Setup group event listeners
    this.socket.on('group:member_joined', (data) => {
      this.emit('group:member_joined', data);
    });

    this.socket.on('group:member_left', (data) => {
      this.emit('group:member_left', data);
    });

    this.socket.on('group:updated', (data) => {
      this.emit('group:updated', data);
    });

    // Setup user event listeners
    this.socket.on('user:typing', (data) => {
      this.emit('user:typing', data);
    });

    this.socket.on('user:online', (data) => {
      this.emit('user:online', data);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Event emitter methods
  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Public methods for subscribing to events
  on<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  // Methods for emitting events to server
  joinGroup(groupId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('group:join', { groupId });
    }
  }

  leaveGroup(groupId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('group:leave', { groupId });
    }
  }

  sendTyping(groupId: string, isTyping: boolean) {
    if (this.socket && this.isConnected) {
      this.socket.emit('user:typing', { groupId, isTyping });
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
