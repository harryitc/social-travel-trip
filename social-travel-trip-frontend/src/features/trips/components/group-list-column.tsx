'use client';

import { useState, useEffect } from 'react';
import { TripGroup } from '../models/trip-group.model';
import { tripGroupService } from '../services/trip-group.service';
import { GroupChatList } from './group-chat-list';
import { GroupListSkeleton } from './chat-skeleton';
import { useEventListeners } from '@/features/stores/useEventListeners';

type GroupListColumnProps = {
  selectedGroupId?: string;
  onSelectGroup: (group: TripGroup) => void;
  initialTripId?: string;
};

/**
 * Component cột trái - Danh sách nhóm
 *
 * Luồng:
 * 1. Mount -> Load danh sách nhóm từ API
 * 2. Sau khi load xong -> Auto-select nhóm (theo initialTripId hoặc nhóm đầu tiên)
 * 3. Auto-select -> Trigger onSelectGroup -> Load messages + chi tiết nhóm
 */
export function GroupListColumn({ selectedGroupId, onSelectGroup, initialTripId }: GroupListColumnProps) {
  const [allGroups, setAllGroups] = useState<TripGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // BƯỚC 1: Load danh sách nhóm từ API
  const loadGroups = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading groups list...');
      const groups = await tripGroupService.getAllGroups();
      console.log('✅ Groups loaded:', groups.length, 'groups');
      setAllGroups(groups);

      // BƯỚC 2: Auto-select nhóm sau khi load xong danh sách
      if (initialTripId && groups.length > 0) {
        console.log('🎯 Looking for initialTripId:', initialTripId);
        const group = groups.find(g => g.id === initialTripId || g.group_id.toString() === initialTripId);
        if (group) {
          console.log('✅ Found initial group:', group.title);
          onSelectGroup(group); // -> Trigger load messages + chi tiết
        } else {
          console.log('❌ Initial group not found, selecting first group');
          onSelectGroup(groups[0]); // -> Trigger load messages + chi tiết
        }
      } else if (groups.length > 0 && !selectedGroupId) {
        console.log('📌 Auto-selecting first group:', groups[0].title);
        onSelectGroup(groups[0]); // -> Trigger load messages + chi tiết
      }
    } catch (error) {
      console.error('❌ Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [initialTripId]);

  // Event listeners setup
  useEventListeners({
    'group:created': (data) => {
      console.log('Group created event received:', data);
      setAllGroups(prev => [data.group, ...prev]);
      onSelectGroup(data.group);
    },
    'group:joined': (data) => {
      console.log('Group joined event received:', data);
      loadGroups(); // Reload to get updated data
      onSelectGroup(data.group);
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
          selectedGroupId={selectedGroupId || ''}
          onSelectGroup={onSelectGroup}
        />
      )}
    </div>
  );
}
