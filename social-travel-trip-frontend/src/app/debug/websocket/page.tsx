'use client';

import { WebSocketDebug } from '@/components/debug/websocket-debug';

export default function WebSocketDebugPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>WebSocket Debug Page</h1>
      <WebSocketDebug />
    </div>
  );
}
