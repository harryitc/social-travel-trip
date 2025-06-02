import { useState, useEffect, useCallback } from 'react';
import websocketService from '@/lib/services/websocket.service';

export interface UseWebSocketMonitorOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  logLevel?: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
}

export interface WebSocketMonitorData {
  stats: any;
  connectionSummary: string;
  eventsSummary: any[];
  recentErrors: any[];
  isConnected: boolean;
  successRate: number;
  totalEvents: number;
  uptime: number;
}

/**
 * Hook để monitor WebSocket connection và events
 */
export const useWebSocketMonitor = (options: UseWebSocketMonitorOptions = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 2000,
    logLevel = 'INFO',
  } = options;

  const [data, setData] = useState<WebSocketMonitorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set log level on mount
  useEffect(() => {
    websocketService.setLogLevel(logLevel);
  }, [logLevel]);

  /**
   * Refresh monitoring data
   */
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [stats, connectionSummary, eventsSummary, recentErrors] = await Promise.all([
        websocketService.getMonitorStats(),
        websocketService.getConnectionSummary(),
        websocketService.getEventsSummary(),
        websocketService.getRecentErrors(10),
      ]);

      setData({
        stats,
        connectionSummary,
        eventsSummary,
        recentErrors,
        isConnected: stats.connection.isConnected,
        successRate: stats.successRate,
        totalEvents: stats.totalEvents,
        uptime: stats.uptime,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error refreshing WebSocket monitor data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear monitoring statistics
   */
  const clearStats = useCallback(() => {
    websocketService.clearMonitorStats();
    refreshData();
  }, [refreshData]);

  /**
   * Export monitoring statistics
   */
  const exportStats = useCallback(() => {
    try {
      const exportData = websocketService.exportMonitorStats();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `websocket-stats-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Error exporting WebSocket stats:', err);
      return false;
    }
  }, []);

  /**
   * Get connection status summary
   */
  const getConnectionStatus = useCallback(() => {
    if (!data) return { status: 'unknown', color: 'default', icon: '❓' };

    if (data.isConnected) {
      return {
        status: 'connected',
        color: 'success',
        icon: '✅',
        message: `Connected (${Math.round(data.stats.connection.connectionDuration / 1000)}s)`,
      };
    } else {
      return {
        status: 'disconnected',
        color: 'error',
        icon: '❌',
        message: 'Disconnected',
      };
    }
  }, [data]);

  /**
   * Get events with issues (low success rate)
   */
  const getProblematicEvents = useCallback(() => {
    if (!data) return [];
    
    return data.eventsSummary.filter(event => event.successRate < 80);
  }, [data]);

  /**
   * Get recent authentication errors
   */
  const getAuthErrors = useCallback(() => {
    if (!data) return [];
    
    return data.recentErrors.filter(error => error.type === 'AUTHENTICATION');
  }, [data]);

  /**
   * Check if there are any critical issues
   */
  const hasCriticalIssues = useCallback(() => {
    if (!data) return false;
    
    return (
      !data.isConnected ||
      data.successRate < 50 ||
      getAuthErrors().length > 0 ||
      getProblematicEvents().length > 0
    );
  }, [data, getAuthErrors, getProblematicEvents]);

  // Auto refresh effect
  useEffect(() => {
    // Initial load
    refreshData();

    if (autoRefresh) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshData]);

  return {
    // Data
    data,
    isLoading,
    error,

    // Actions
    refreshData,
    clearStats,
    exportStats,

    // Computed values
    connectionStatus: getConnectionStatus(),
    problematicEvents: getProblematicEvents(),
    authErrors: getAuthErrors(),
    hasCriticalIssues: hasCriticalIssues(),

    // Quick access to common values
    isConnected: data?.isConnected ?? false,
    successRate: data?.successRate ?? 0,
    totalEvents: data?.totalEvents ?? 0,
    uptime: data?.uptime ?? 0,
    recentErrors: data?.recentErrors ?? [],
    eventsSummary: data?.eventsSummary ?? [],
  };
};

/**
 * Hook để chỉ theo dõi connection status (lightweight)
 */
export const useWebSocketConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionSummary, setConnectionSummary] = useState('');

  const checkConnection = useCallback(async () => {
    try {
      const stats = await websocketService.getMonitorStats();
      const summary = await websocketService.getConnectionSummary();
      
      setIsConnected(stats.connection.isConnected);
      setConnectionSummary(summary);
    } catch (error) {
      console.error('Error checking WebSocket connection:', error);
      setIsConnected(false);
      setConnectionSummary('Error checking connection');
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    // Check every 5 seconds
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    isConnected,
    connectionSummary,
    refresh: checkConnection,
  };
};

/**
 * Hook để theo dõi WebSocket errors
 */
export const useWebSocketErrors = (limit: number = 5) => {
  const [errors, setErrors] = useState<any[]>([]);
  const [hasNewErrors, setHasNewErrors] = useState(false);

  const refreshErrors = useCallback(async () => {
    try {
      const recentErrors = await websocketService.getRecentErrors(limit);
      
      // Check if there are new errors
      if (recentErrors.length > errors.length) {
        setHasNewErrors(true);
      }
      
      setErrors(recentErrors);
    } catch (error) {
      console.error('Error fetching WebSocket errors:', error);
    }
  }, [limit, errors.length]);

  const markErrorsAsRead = useCallback(() => {
    setHasNewErrors(false);
  }, []);

  useEffect(() => {
    refreshErrors();
    
    // Check for new errors every 10 seconds
    const interval = setInterval(refreshErrors, 10000);
    return () => clearInterval(interval);
  }, [refreshErrors]);

  return {
    errors,
    hasNewErrors,
    markErrorsAsRead,
    refresh: refreshErrors,
  };
};

export default useWebSocketMonitor;
