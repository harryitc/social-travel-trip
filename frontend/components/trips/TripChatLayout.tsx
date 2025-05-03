'use client';

import { useState, useEffect, useMemo } from 'react';
import { GroupChatList } from './GroupChatList';
import { TripChat } from './trip-chat';
import { GroupChatDetails } from './GroupChatDetails';
import { MOCK_TRIP_GROUPS, TripGroup } from './mock-trip-groups';
import { useUser } from '@clerk/nextjs';

type TripChatLayoutProps = {
  initialTripId: string;
};

export function TripChatLayout({ initialTripId }: TripChatLayoutProps) {
  const { user } = useUser();
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(
    MOCK_TRIP_GROUPS.find(group => group.id === initialTripId) || null
  );

  // Hiển thị tất cả các nhóm có trong hệ thống, không lọc theo người dùng
  const allGroups = useMemo(() => {
    // Trả về tất cả các nhóm từ mock data
    return MOCK_TRIP_GROUPS;
  }, []);

  const handleSelectGroup = (group: TripGroup) => {
    setSelectedGroup(group);
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md">
      {/* Left column - Group list */}
      <div className="w-[260px] border-r border-purple-100 dark:border-purple-900">
        <GroupChatList
          groups={allGroups}
          selectedGroupId={selectedGroup?.id || ''}
          onSelectGroup={handleSelectGroup}
        />
      </div>

      {/* Middle column - Chat area */}
      <div className="flex-1">
        {selectedGroup ? (
          <TripChat
            tripId={selectedGroup.id}
            members={selectedGroup.members.list}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-lg font-medium">Chọn một nhóm để bắt đầu trò chuyện</h3>
              <p className="text-sm text-muted-foreground">Hoặc tạo một nhóm mới từ trang Chuyến đi</p>
            </div>
          </div>
        )}
      </div>

      {/* Right column - Group details */}
      <div className="w-[300px] border-l border-purple-100 dark:border-purple-900">
        {selectedGroup && (
          <GroupChatDetails group={selectedGroup} />
        )}
      </div>
    </div>
  );
}
