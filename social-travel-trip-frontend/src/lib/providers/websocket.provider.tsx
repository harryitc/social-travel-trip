'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import websocketService, { WebsocketEvent } from '@/lib/services/websocket.service';
import { useAuth } from '@/features/auth/hooks/use-auth';

// Define the context type
type WebSocketContextType = {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  on: (event: WebsocketEvent, handler: (data: any) => void) => void;
  off: (event: WebsocketEvent, handler: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
};

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  on: () => {},
  off: () => {},
  emit: () => {},
});

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

// WebSocket provider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated]);

  // Connect to WebSocket
  const connect = async () => {
    try {
      await websocketService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    websocketService.disconnect();
    setIsConnected(false);
  };

  // Register event handler
  const on = (event: WebsocketEvent, handler: (data: any) => void) => {
    websocketService.on(event, handler);
  };

  // Remove event handler
  const off = (event: WebsocketEvent, handler: (data: any) => void) => {
    websocketService.off(event, handler);
  };

  // Emit event
  const emit = (event: string, data: any) => {
    websocketService.emit(event, data);
  };

  // Context value
  const value = {
    isConnected,
    connect,
    disconnect,
    on,
    off,
    emit,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
