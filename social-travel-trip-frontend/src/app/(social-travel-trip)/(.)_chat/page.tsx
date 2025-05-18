'use client';

import { TripChatLayout } from '@/features/trips/TripChatLayout';

export default function ChatPage() {
  return (
    <div className="container py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Trò chuyện nhóm</h1>
      <div className="h-[calc(100vh-180px)]">
        <TripChatLayout initialTripId="1" />
      </div>
    </div>
  );
}
