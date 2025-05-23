'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TabMenu } from "@/components/common/TabMenu";
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { TripBreadcrumb } from '@/features/trips/components/trip-breadcrumb';
import { GroupListColumn, ChatColumn, GroupDetailsColumn } from '@/features/trips/components';

export default function TripPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);

  const handleSelectGroup = (group: TripGroup) => {
    console.log('🎯 Selected group:', group.id, group.title);
    setSelectedGroup(group);

    // Cập nhật URL để có thể chia sẻ link
    router.replace(`/trips/${group.id}`);
  };

  return (
    <>
      <TabMenu />
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb */}
          <div className="px-4 pt-4 bg-gray-50 dark:bg-gray-900">
            <TripBreadcrumb selectedGroup={selectedGroup} />
          </div>

          {/* Main 3-column layout */}
          <div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 p-4 gap-4">
            {/* Left column - Group list */}
            <GroupListColumn
              selectedGroupId={selectedGroup?.id}
              onSelectGroup={handleSelectGroup}
              initialTripId={params.id as string}
            />

            {/* Center column - Chat area */}
            <ChatColumn selectedGroup={selectedGroup} />

            {/* Right column - Group details */}
            <GroupDetailsColumn selectedGroup={selectedGroup} />
          </div>
        </div>
      </div>
    </>
  );
}