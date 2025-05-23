'use client';

import { TripChatLayout } from '@/features/trips/TripChatLayout';
import { useParams } from 'next/navigation';

export default function TripPage() {
  const params = useParams();

  return (
    <div className="w-full overflow-hidden">
      <div className="h-[calc(100vh-7rem)]">
        <TripChatLayout key={'detail'} initialTripId={params.id as string} />
      </div>
    </div>
  );
}