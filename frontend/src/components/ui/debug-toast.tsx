'use client';

import { useEffect, useState } from 'react';
import { Alert } from 'antd';

interface DebugMessage {
  id: string;
  serviceName: string;
  timestamp: string;
  args?: any[];
}

export default function DebugToast() {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDev) return;

    const handleServiceCall = (event: CustomEvent) => {
      const { serviceName, timestamp, args } = event.detail;
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        serviceName,
        timestamp,
        args
      }]);
    };

    window.addEventListener('service-called', handleServiceCall as EventListener);
    return () => window.removeEventListener('service-called', handleServiceCall as EventListener);
  }, [isDev]);

  useEffect(() => {
    if (!isDev) return;
    
    const interval = setInterval(() => {
      setMessages(prev => 
        prev.filter(msg => Date.now() - new Date(msg.timestamp).getTime() < 3000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isDev]);

  if (!isDev || messages.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      {messages.map(msg => (
        <Alert
          key={msg.id}
          message={`${msg.timestamp} - ${msg.serviceName}`}
          description={msg.args?.length ? `Args: ${JSON.stringify(msg.args)}` : undefined}
          type="info"
          showIcon
          closable
          className="bg-white/90 backdrop-blur-sm"
        />
      ))}
    </div>
  );
}
