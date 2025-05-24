'use client';

import { useState } from 'react';
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { GroupChatDetails } from '@/features/trips/GroupChatDetails';
import { Users } from 'lucide-react';
import { useEventListeners } from '@/features/stores/useEventListeners';

/**
 * Parallel Route: @details/trips
 * Right column - Group details with empty state
 */
export default function DetailsPage() {
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);

  // Listen to group selection events
  useEventListeners({
    'group:selected': (data) => {
      console.log('📋 [DetailsPage] Group selected:', data.group.id, data.group.title);
      setSelectedGroup(data.group);
    },
    'group:updated': (data) => {
      // Update group info if it's the currently selected group
      if (selectedGroup && selectedGroup.id === data.group.id) {
        console.log('📋 [DetailsPage] Group updated:', data.group.title);
        setSelectedGroup(data.group);
      }
    },
    'group:member_added': (data) => {
      // Update group info if it's the currently selected group
      if (selectedGroup && selectedGroup.id === data.group.id) {
        console.log('📋 [DetailsPage] Member added to group:', data.member);
        setSelectedGroup(data.group);
      }
    },
    'group:member_removed': (data) => {
      // Update group info if it's the currently selected group
      if (selectedGroup && selectedGroup.id === data.group.id) {
        console.log('📋 [DetailsPage] Member removed from group:', data.memberId);
        setSelectedGroup(data.group);
      }
    },
  });

  return (
    <div className="w-[350px] min-w-[350px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
      {selectedGroup ? (
        <GroupChatDetails group={selectedGroup} isCollapsed={false} />
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Chi tiết nhóm
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chọn một nhóm để xem thông tin chi tiết
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
