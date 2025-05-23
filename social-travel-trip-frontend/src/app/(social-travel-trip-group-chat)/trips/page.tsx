'use client';

import { TripChatLayout } from '@/features/trips/TripChatLayout';
import { TabMenu } from "@/components/common/TabMenu";

export default function TripsPage() {
  return (
    <>
      <TabMenu />
      <div className="w-full overflow-hidden">
        <div className="h-[calc(100vh-7rem)]">
          <TripChatLayout key={'list'} />
        </div>
      </div>
    </>
  );
}
