'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { GroupChatList } from '@/features/trips/components/group-chat-list';
import { GroupListSkeleton } from '@/features/trips/components/chat-skeleton';
import { useEventListeners } from '@/features/stores/useEventListeners';
import { useEventStore, useGroupStore } from '@/features/stores/event.store';
import { groupStoreService } from '@/features/trips/services/group-store.service';

/**
 * Parallel Route: @groups/trips
 * Left column - Group list without pre-selection
 */
export default function GroupsPage() {
  const router = useRouter();
  const { emit } = useEventStore();

  // Sử dụng store thay vì local state
  const { groups, selectedGroupId, loading } = useGroupStore();

  // Handle group selection with Zustand events
  const handleSelectGroup = (group: TripGroup) => {
    console.log('🎯 [GroupsPage] Selected group:', group.id, group.title);
    groupStoreService.setSelectedGroup(group.id);

    // Update URL to specific trip
    router.push(`/trips/${group.id}`);

    // Emit event for other components to listen
    emit('group:selected', { group });
  };

  useEffect(() => {
    console.log("📋 [GroupsPage] Loading groups on mount");
    groupStoreService.loadGroups();
  }, []);

  // Listen to group events
  useEventListeners({
    'group:created': (data) => {
      console.log('Group created event received:', data);
      groupStoreService.addGroup(data.group);
      handleSelectGroup(data.group);
    },
    'group:updated': (data) => {
      console.log('Group updated event received:', data);
      groupStoreService.updateGroup(data.group);
    },
  });

  return (
    <div className="w-[320px] min-w-[320px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
      {loading ? (
        <GroupListSkeleton />
      ) : (
        <GroupChatList
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
        />
      )}
    </div>
  );
}
