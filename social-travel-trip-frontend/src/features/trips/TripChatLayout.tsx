'use client';

import { useState, useMemo, useEffect } from 'react';
import { GroupChatList } from './components/group-chat-list';
import { TripChat } from './trip-chat';
import { GroupChatDetails } from './GroupChatDetails';
import { TripTabMenu } from './TripTabMenu';
import { MOCK_TRIP_GROUPS, TripGroup } from './mock-trip-groups';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/radix-ui/button';

type TripChatLayoutProps = {
  initialTripId?: string;
};

export function TripChatLayout({ initialTripId }: TripChatLayoutProps) {
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(
    initialTripId ? MOCK_TRIP_GROUPS.find(group => group.id === initialTripId) || null : null
  );
  const [showDetails, setShowDetails] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const checkScreenSize = () => {
      const isTabletSize = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsTablet(isTabletSize);

      // Khi ở chế độ tablet, luôn hiển thị layout dọc (showDetails = true)
      if (isTabletSize) {
        setShowDetails(true);
      }
    };

    // Kiểm tra kích thước ban đầu
    checkScreenSize();

    // Thêm event listener để theo dõi thay đổi kích thước
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Hiển thị tất cả các nhóm có trong hệ thống, không lọc theo người dùng
  const allGroups = useMemo(() => {
    // Trả về tất cả các nhóm từ mock data
    return MOCK_TRIP_GROUPS;
  }, []);

  const handleSelectGroup = (group: TripGroup) => {
    setSelectedGroup(group);
    // Khi chọn nhóm mới, hiển thị chi tiết nếu đang ở chế độ ẩn và không phải ở chế độ tablet
    if (!showDetails && !isTablet) {
      setShowDetails(true);
    }
  };

  // Không cho phép toggle chi tiết nhóm trong responsive design Tablet-768px
  const toggleDetails = () => {
    // Chỉ cho phép toggle chi tiết nhóm khi không phải ở responsive design Tablet-768px
    if (!isTablet) {
      setShowDetails(!showDetails);
    }
  };

  // Xử lý khi tab thay đổi
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full max-w-full">
      {/* Tab Menu for Tablet - Only visible on md screens */}
      {selectedGroup && (
        <TripTabMenu
          tripId={selectedGroup.id}
          onTabChange={handleTabChange}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left column - Group list */}
        <div className="w-[320px] md:w-[320px] lg:w-[320px] min-w-[320px] flex-shrink-0 rounded-lg border border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 shadow-md mr-3 md:mr-2 lg:mr-3 overflow-hidden">
          <GroupChatList
            groups={allGroups}
            selectedGroupId={selectedGroup?.id || ''}
            onSelectGroup={handleSelectGroup}
          />
        </div>

        {/* Middle and Right columns container */}
        <div className="flex flex-1 rounded-lg border border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs shadow-md overflow-hidden">
        {/* Middle column - Chat area */}
        <div className={`flex-1 min-w-0 overflow-hidden relative ${selectedGroup ? 'flex flex-col' : ''}`}>
          {selectedGroup ? (
            <>
              {/* Tablet view with tab menu */}
              {isTablet ? (
                <div className="flex flex-col h-full">
                  {/* Content based on active tab */}
                  {activeTab === 'chat' && (
                    <>
                      {/* Fixed group info at top */}
                      <div className="flex-shrink-0 border-b border-purple-100 dark:border-purple-900">
                        <GroupChatDetails group={selectedGroup} isCollapsed={isTablet} />
                      </div>

                      {/* Scrollable chat area */}
                      <div className="flex-1 overflow-hidden">
                        <TripChat
                          tripId={selectedGroup.id}
                          members={selectedGroup.members.list}
                          isTablet={isTablet}
                          isVerticalLayout={true}
                        />
                      </div>
                    </>
                  )}

                  {/* Tab Planning đã được chuyển thành link đến trang /planning */}
                </div>
              ) : (
                <>
                  {/* Desktop/Mobile layout */}
                  <TripChat
                    tripId={selectedGroup.id}
                    members={selectedGroup.members.list}
                    isTablet={isTablet}
                  />
                </>
              )}

              {/* Nút điều hướng đã bị xóa theo yêu cầu */}
            </>
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

        {/* Right column - Group details (only for desktop and mobile, or tablet with hidden vertical layout) */}
        <div
          className={`border-l border-purple-100 dark:border-purple-900 flex-shrink-0 transition-all duration-300
            ${showDetails ? 'w-[400px] lg:min-w-[350px]' : 'w-0 min-w-0'}
            md:absolute md:right-0 md:top-0 md:bottom-0 md:z-20 md:bg-white/95 md:dark:bg-gray-950/95 md:backdrop-blur-sm md:shadow-lg
            ${showDetails ? 'md:translate-x-0 md:w-[280px]' : 'md:translate-x-full'}
            ${isTablet && showDetails ? 'md:hidden' : ''}
            lg:static lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:dark:bg-transparent`}
        >
          {selectedGroup && showDetails && !isTablet && (
            <GroupChatDetails group={selectedGroup} isCollapsed={isTablet} />
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
