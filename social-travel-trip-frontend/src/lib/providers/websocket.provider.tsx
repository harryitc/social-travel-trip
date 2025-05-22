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
  emit: (event: string, data: any) => Promise<void>;
};

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  on: () => {},
  off: () => {},
  emit: async () => {},
});

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

// WebSocket provider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  // Connect to WebSocket when authenticated
  useEffect(() => {
    console.log('WebSocket Provider: Authentication state changed:', isAuthenticated);

    if (isAuthenticated) {
      console.log('WebSocket Provider: Attempting to connect...');
      connect();
    } else {
      console.log('WebSocket Provider: Disconnecting due to not authenticated');
      disconnect();
    }

    return () => {
      console.log('WebSocket Provider: Cleanup - disconnecting');
      disconnect();
    };
  }, [isAuthenticated]);

  // Connect to WebSocket
  const connect = async () => {
    try {
      console.log('WebSocket Provider: Connecting to WebSocket service...');
      await websocketService.connect();
      console.log('WebSocket Provider: Successfully connected');
      setIsConnected(true);
    } catch (error) {
      console.error('WebSocket Provider: Failed to connect to WebSocket:', error);
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
  const emit = async (event: string, data: any): Promise<void> => {
    try {
      console.log('WebSocket Provider: Emitting event', event);
      await websocketService.emit(event, data);
      console.log('WebSocket Provider: Event emitted successfully');
    } catch (error) {
      console.error('WebSocket Provider: Error emitting event:', error);
    }
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
