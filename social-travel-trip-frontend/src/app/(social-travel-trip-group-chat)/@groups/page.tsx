'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { tripGroupService } from '@/features/trips/services/trip-group.service';
import { GroupChatList } from '@/features/trips/components/group-chat-list';
import { GroupListSkeleton } from '@/features/trips/components/chat-skeleton';
import { useEventListeners } from '@/features/stores/useEventListeners';
import { useEventStore } from '@/features/stores/event.store';

/**
 * Parallel Route: @groups
 * Left column - Group list with Zustand event management
 * Route: /trips (không có [id])
 */
export default function GroupsPage() {
  const router = useRouter();
  const { emit } = useEventStore();

  const [allGroups, setAllGroups] = useState<TripGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load groups from API
  const loadGroups = async () => {
    try {
      setLoading(true);
      console.log('📋 [GroupsPage] Loading groups list...');
      const groups = await tripGroupService.getAllGroups();
      console.log('✅ [GroupsPage] Groups loaded:', groups.length, 'groups');
      setAllGroups(groups);

      // Auto-select first group when no specific group in URL
      if (groups.length > 0 && !selectedGroupId) {
        console.log('📌 [GroupsPage] Auto-selecting first group:', groups[0].title);
        handleSelectGroup(groups[0]);
      }
    } catch (error) {
      console.error('❌ [GroupsPage] Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle group selection with Zustand events
  const handleSelectGroup = (group: TripGroup) => {
    console.log('🎯 [GroupsPage] Selected group:', group.id, group.title);
    setSelectedGroupId(group.id);

    // Update URL to specific group
    router.push(`/trips/${group.id}`);

    // Emit event for other components to listen
    emit('group:selected', { group });
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Listen to group events
  useEventListeners({
    'group:created': (data) => {
      console.log('[GroupsPage] Group created event received:', data);
      setAllGroups(prev => [data.group, ...prev]);
      handleSelectGroup(data.group);
    },
    'group:joined': (data) => {
      console.log('[GroupsPage] Group joined event received:', data);
      loadGroups(); // Reload to get updated data
      handleSelectGroup(data.group);
    },
    'group:updated': (data) => {
      console.log('[GroupsPage] Group updated event received:', data);
      setAllGroups(prev => prev.map(group =>
        group.id === data.group.id ? data.group : group
      ));
    },
  });

  return (
    <div className="w-[320px] min-w-[320px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
      {loading ? (
        <GroupListSkeleton />
      ) : (
        <GroupChatList
          groups={allGroups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
        />
      )}
    </div>
  );
}
