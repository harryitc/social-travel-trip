/**
 * WebSocket Monitor Service
 * Theo dõi và thống kê WebSocket connection, events, và errors
 */

export interface ConnectionStatus {
  isConnected: boolean;
  socketId: string | null;
  connectedAt: Date | null;
  disconnectedAt: Date | null;
  connectionDuration: number; // milliseconds
  reconnectAttempts: number;
  lastError: WebSocketMonitorError | null;
}

export interface EventStats {
  eventName: string;
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  lastSuccess: Date | null;
  lastFailure: Date | null;
  averageResponseTime: number;
  errors: WebSocketMonitorError[];
}

export interface WebSocketMonitorError {
  type: 'CONNECTION' | 'AUTHENTICATION' | 'NETWORK' | 'EVENT' | 'SERVER';
  message: string;
  timestamp: Date;
  details?: any;
  eventName?: string;
}

export interface WebSocketStats {
  connection: ConnectionStatus;
  events: Map<string, EventStats>;
  errors: WebSocketMonitorError[];
  totalEvents: number;
  successRate: number;
  uptime: number;
}

class WebSocketMonitorService {
  private stats: WebSocketStats;
  private startTime: Date;
  private logLevel: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' = 'WARN';

  constructor() {
    this.startTime = new Date();
    this.stats = {
      connection: {
        isConnected: false,
        socketId: null,
        connectedAt: null,
        disconnectedAt: null,
        connectionDuration: 0,
        reconnectAttempts: 0,
        lastError: null,
      },
      events: new Map(),
      errors: [],
      totalEvents: 0,
      successRate: 0,
      uptime: 0,
    };
  }

  /**
   * Set logging level
   */
  setLogLevel(level: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'): void {
    this.logLevel = level;
  }

  /**
   * Log message based on level
   */
  private log(level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG', message: string, data?: any): void {
    const levels = { NONE: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4 };
    const currentLevel = levels[this.logLevel];
    const messageLevel = levels[level];

    if (messageLevel <= currentLevel) {
      const prefix = `[WebSocket ${level}]`;
      const logMethod = level.toLowerCase() as 'error' | 'warn' | 'info' | 'debug';

      if (data) {
        (console[logMethod] as any)(prefix, message, data);
      } else {
        (console[logMethod] as any)(prefix, message);
      }
    }
  }

  /**
   * Record connection established
   */
  onConnected(socketId: string): void {
    const now = new Date();
    this.stats.connection = {
      ...this.stats.connection,
      isConnected: true,
      socketId,
      connectedAt: now,
      disconnectedAt: null,
      reconnectAttempts: 0,
    };
    
    this.log('INFO', `Connected to WebSocket server (ID: ${socketId})`);
  }

  /**
   * Record connection lost
   */
  onDisconnected(reason?: string): void {
    const now = new Date();
    const duration = this.stats.connection.connectedAt 
      ? now.getTime() - this.stats.connection.connectedAt.getTime()
      : 0;

    this.stats.connection = {
      ...this.stats.connection,
      isConnected: false,
      disconnectedAt: now,
      connectionDuration: duration,
    };

    this.log('WARN', `Disconnected from WebSocket server${reason ? ` (${reason})` : ''}`);
  }

  /**
   * Record reconnection attempt
   */
  onReconnectAttempt(attempt: number): void {
    this.stats.connection.reconnectAttempts = attempt;
    this.log('INFO', `Reconnection attempt ${attempt}`);
  }

  /**
   * Record error
   */
  onError(error: WebSocketMonitorError): void {
    this.stats.errors.push(error);
    this.stats.connection.lastError = error;

    // Keep only last 50 errors
    if (this.stats.errors.length > 50) {
      this.stats.errors = this.stats.errors.slice(-50);
    }

    this.log('ERROR', `WebSocket ${error.type} Error: ${error.message}`, error.details);
  }

  /**
   * Record event attempt
   */
  onEventAttempt(eventName: string): void {
    if (!this.stats.events.has(eventName)) {
      this.stats.events.set(eventName, {
        eventName,
        totalAttempts: 0,
        successCount: 0,
        failureCount: 0,
        lastSuccess: null,
        lastFailure: null,
        averageResponseTime: 0,
        errors: [],
      });
    }

    const eventStats = this.stats.events.get(eventName)!;
    eventStats.totalAttempts++;
    this.stats.totalEvents++;

    // Event attempt tracking - no logging needed
  }

  /**
   * Record event success
   */
  onEventSuccess(eventName: string, responseTime?: number): void {
    const eventStats = this.stats.events.get(eventName);
    if (eventStats) {
      eventStats.successCount++;
      eventStats.lastSuccess = new Date();
      
      if (responseTime) {
        eventStats.averageResponseTime = 
          (eventStats.averageResponseTime * (eventStats.successCount - 1) + responseTime) / eventStats.successCount;
      }
    }

    this.updateSuccessRate();
  }

  /**
   * Record event failure
   */
  onEventFailure(eventName: string, error: string): void {
    const eventStats = this.stats.events.get(eventName);
    if (eventStats) {
      eventStats.failureCount++;
      eventStats.lastFailure = new Date();
      
      const eventError: WebSocketMonitorError = {
        type: 'EVENT',
        message: error,
        timestamp: new Date(),
        eventName,
      };
      
      eventStats.errors.push(eventError);
      
      // Keep only last 10 errors per event
      if (eventStats.errors.length > 10) {
        eventStats.errors = eventStats.errors.slice(-10);
      }
    }

    this.updateSuccessRate();
    this.log('WARN', `Event failure: ${eventName} - ${error}`);
  }

  /**
   * Update overall success rate
   */
  private updateSuccessRate(): void {
    let totalSuccess = 0;
    let totalAttempts = 0;

    this.stats.events.forEach(eventStats => {
      totalSuccess += eventStats.successCount;
      totalAttempts += eventStats.totalAttempts;
    });

    this.stats.successRate = totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
  }

  /**
   * Get current statistics
   */
  getStats(): WebSocketStats {
    // Update uptime
    this.stats.uptime = new Date().getTime() - this.startTime.getTime();
    
    // Update connection duration if connected
    if (this.stats.connection.isConnected && this.stats.connection.connectedAt) {
      this.stats.connection.connectionDuration = 
        new Date().getTime() - this.stats.connection.connectedAt.getTime();
    }

    return { ...this.stats };
  }

  /**
   * Get connection summary
   */
  getConnectionSummary(): string {
    const { connection } = this.stats;
    if (connection.isConnected) {
      const duration = Math.round(connection.connectionDuration / 1000);
      return `✅ Connected (${duration}s) - ID: ${connection.socketId}`;
    } else {
      const lastError = connection.lastError?.message || 'Unknown';
      return `❌ Disconnected - Last error: ${lastError}`;
    }
  }

  /**
   * Get events summary
   */
  getEventsSummary(): Array<{
    event: string;
    successRate: number;
    total: number;
    status: string;
  }> {
    return Array.from(this.stats.events.entries()).map(([eventName, stats]) => {
      const successRate = stats.totalAttempts > 0 
        ? (stats.successCount / stats.totalAttempts) * 100 
        : 0;
      
      let status = '✅ Good';
      if (successRate < 50) status = '❌ Poor';
      else if (successRate < 80) status = '⚠️ Fair';

      return {
        event: eventName,
        successRate: Math.round(successRate),
        total: stats.totalAttempts,
        status,
      };
    });
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): WebSocketMonitorError[] {
    return this.stats.errors.slice(-limit);
  }

  /**
   * Clear statistics
   */
  clearStats(): void {
    this.stats.events.clear();
    this.stats.errors = [];
    this.stats.totalEvents = 0;
    this.stats.successRate = 0;
    this.startTime = new Date();
    
    this.log('INFO', 'WebSocket statistics cleared');
  }

  /**
   * Export stats as JSON
   */
  exportStats(): string {
    const exportData = {
      ...this.getStats(),
      events: Array.from(this.stats.events.entries()),
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

// Create singleton instance
export const websocketMonitor = new WebSocketMonitorService();
export default websocketMonitor;
