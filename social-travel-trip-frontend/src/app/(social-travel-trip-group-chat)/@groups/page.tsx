'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { tripGroupService } from '@/features/trips/services/trip-group.service';
import { GroupChatList } from '@/features/trips/components/group-chat-list';
import { GroupListSkeleton } from '@/features/trips/components/chat-skeleton';
import { useEventListeners } from '@/features/stores/useEventListeners';
import { useEventStore } from '@/features/stores/event.store';

/**
 * Parallel Route: @groups
 * Left column - Group list with Zustand event management
 */
export default function GroupsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { emit } = useEventStore();
  
  const [allGroups, setAllGroups] = useState<TripGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Extract group ID from URL path
  const getGroupIdFromPath = () => {
    const match = pathname.match(/\/trips\/([^\/]+)/);
    return match ? match[1] : '';
  };

  // Load groups from API
  const loadGroups = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading groups list...');
      const groups = await tripGroupService.getAllGroups();
      console.log('✅ Groups loaded:', groups.length, 'groups');
      setAllGroups(groups);

      // Auto-select group based on URL
      const urlGroupId = getGroupIdFromPath();
      if (urlGroupId && groups.length > 0) {
        const group = groups.find(g => g.id === urlGroupId || g.group_id.toString() === urlGroupId);
        if (group) {
          console.log('✅ Found URL group:', group.title);
          handleSelectGroup(group);
        } else {
          console.log('❌ URL group not found, selecting first group');
          handleSelectGroup(groups[0]);
        }
      } else if (groups.length > 0 && !selectedGroupId) {
        console.log('📌 Auto-selecting first group:', groups[0].title);
        handleSelectGroup(groups[0]);
      }
    } catch (error) {
      console.error('❌ Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle group selection with Zustand events
  const handleSelectGroup = (group: TripGroup) => {
    console.log('🎯 Selected group:', group.id, group.title);
    setSelectedGroupId(group.id);
    
    // Update URL
    router.replace(`/trips/${group.id}`);
    
    // Emit event for other components to listen
    emit('group:selected', { group });
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Listen to group events
  useEventListeners({
    'group:created': (data) => {
      console.log('Group created event received:', data);
      setAllGroups(prev => [data.group, ...prev]);
      handleSelectGroup(data.group);
    },
    'group:joined': (data) => {
      console.log('Group joined event received:', data);
      loadGroups(); // Reload to get updated data
      handleSelectGroup(data.group);
    },
    'group:updated': (data) => {
      console.log('Group updated event received:', data);
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
