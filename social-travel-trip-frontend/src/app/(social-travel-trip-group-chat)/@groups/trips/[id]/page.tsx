'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { GroupChatList } from '@/features/trips/components/group-chat-list';
import { GroupListSkeleton } from '@/features/trips/components/chat-skeleton';
import { useEventListeners } from '@/features/stores/useEventListeners';
import { useEventStore, useGroupStore } from '@/features/stores/event.store';
import { groupStoreService } from '@/features/trips/services/group-store.service';

/**
 * Parallel Route: @groups/trips/[id]
 * Left column - Group list with specific group selected
 */
export default function GroupsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { emit } = useEventStore();

  // Sử dụng store thay vì local state
  const { groups, selectedGroupId, loading } = useGroupStore();

  // Handle group selection with Zustand events
  const handleSelectGroup = (group: TripGroup) => {
    console.log('🎯 [GroupsDetailPage] Selected group:', group.id, group.title);
    groupStoreService.setSelectedGroup(group.id);

    // Update URL to specific trip
    router.push(`/trips/${group.id}`);

    // Emit event for other components to listen
    emit('group:selected', { group });
  };

  useEffect(() => {
    console.log("📋 [GroupsDetailPage] Component mounted/params changed");

    // Load groups chỉ khi chưa có data (không force reload)
    groupStoreService.loadGroups(false);
  }, []);

  useEffect(() => {
    // Set selected group từ URL params khi params.id thay đổi
    if (params.id) {
      console.log("🎯 [GroupsDetailPage] Setting selected group from URL:", params.id);
      groupStoreService.setSelectedGroup(params.id as string);
    }
  }, [params.id]);

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
