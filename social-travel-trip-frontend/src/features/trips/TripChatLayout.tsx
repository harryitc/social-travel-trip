'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GroupChatList } from './components/group-chat-list';
import { TripBreadcrumb } from './components/trip-breadcrumb';
import { TripChat } from './trip-chat';
import { GroupChatDetails } from './GroupChatDetails';
import { TripTabMenu } from './TripTabMenu';
import { GroupListSkeleton } from './components/chat-skeleton';
import { TripGroup } from './models/trip-group.model';
import { tripGroupService } from './services/trip-group.service';
import { Users, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/radix-ui/button';
import { useEventListeners } from '@/features/stores/useEventListeners';

type TripChatLayoutProps = {
  initialTripId?: string;
};

export function TripChatLayout({ initialTripId }: TripChatLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);
  const [allGroups, setAllGroups] = useState<TripGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Load groups from API
  const loadGroups = async () => {
    try {
      setLoading(true);
      const groups = await tripGroupService.getAllGroups();
      console.log('Loaded groups:', groups); // Debug log
      setAllGroups(groups);

      // If initialTripId is provided, find and set the selected group
      if (initialTripId) {
        const group = groups.find(g => g.id === initialTripId || g.group_id.toString() === initialTripId);
        if (group) {
          setSelectedGroup(group);
        }
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [initialTripId]);

  // Theo dõi kích thước màn hình
  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     const isTabletSize = window.innerWidth >= 768 && window.innerWidth < 1024;
  //     setIsTablet(isTabletSize);

  //     // Khi ở chế độ tablet, luôn hiển thị layout dọc (showDetails = true)
  //     if (isTabletSize) {
  //       setShowDetails(true);
  //     }
  //   };

  //   // Kiểm tra kích thước ban đầu
  //   checkScreenSize();

  //   // Thêm event listener để theo dõi thay đổi kích thước
  //   window.addEventListener('resize', checkScreenSize);

  //   // Cleanup
  //   return () => window.removeEventListener('resize', checkScreenSize);
  // }, []);

  // Event listeners setup
  useEventListeners({
    'group:created': (data) => {
      console.log('Group created event received:', data);
      setAllGroups(prev => [data.group, ...prev]);
      setSelectedGroup(data.group);
      router.push(`/trips/${data.group.id}`);
    },
    'group:joined': (data) => {
      console.log('Group joined event received:', data);
      loadGroups(); // Reload to get updated data
      setSelectedGroup(data.group);
      router.push(`/trips/${data.group.id}`);
    },
    'group:updated': (data) => {
      console.log('Group updated event received:', data);
      setAllGroups(prev => prev.map(group =>
        group.id === data.group.id ? data.group : group
      ));
      if (selectedGroup?.id === data.group.id) {
        setSelectedGroup(data.group);
      }
    },
  });

  const handleSelectGroup = (group: TripGroup) => {
    setSelectedGroup(group);

    // Cập nhật URL để có thể chia sẻ link
    if (pathname === '/trips') {
      // Nếu đang ở trang trips chính, chuyển đến trang trips/[id]
      router.push(`/trips/${group.id}`);
    } else {
      // Nếu đã ở trang trips/[id], chỉ cần replace URL
      router.replace(`/trips/${group.id}`);
    }

    // Khi chọn nhóm mới, hiển thị chi tiết nếu đang ở chế độ ẩn và không phải ở chế độ tablet
    if (!showDetails && !isTablet) {
      setShowDetails(true);
    }
  };

  // Xử lý khi tạo nhóm mới từ empty state
  const handleCreateGroupFromEmpty = () => {
    // Trigger create group dialog từ GroupChatList component
    // Có thể sử dụng event hoặc callback để communicate với GroupChatList
    const createButton = document.querySelector('[data-create-group-trigger]') as HTMLButtonElement;
    if (createButton) {
      createButton.click();
    }
  };

  // Xử lý khi tìm kiếm từ empty state
  const handleSearchFromEmpty = () => {
    // Focus vào search input
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
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
    <div className="flex flex-col h-full overflow-hidden w-full max-w-full bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="px-4 pt-4">
        <TripBreadcrumb selectedGroup={selectedGroup} />
      </div>

      {/* Tab Menu for Tablet - Only visible on md screens */}
      {selectedGroup && (
        <TripTabMenu
          tripId={selectedGroup.id}
          onTabChange={handleTabChange}
        />
      )}

      <div className="flex flex-1 overflow-hidden gap-4 px-4 pb-4">
        {/* Left column - Group list */}
        <div className="w-[320px] md:w-[320px] lg:w-[320px] min-w-[320px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
          {loading ? (
            <GroupListSkeleton />
          ) : (
            <GroupChatList
              groups={allGroups}
              selectedGroupId={selectedGroup?.id || ''}
              onSelectGroup={handleSelectGroup}
            />
          )}
        </div>

        {/* Middle and Right columns container */}
        <div className="flex flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
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
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-6 max-w-md mx-auto px-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Chào mừng đến với Nhóm chuyến đi
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Chọn một nhóm từ danh sách bên trái để bắt đầu trò chuyện và lên kế hoạch cho chuyến đi của bạn
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={handleSearchFromEmpty}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Tìm nhóm
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateGroupFromEmpty}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo nhóm mới
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Group details (only for desktop and mobile, or tablet with hidden vertical layout) */}
        <div
          className={`border-l border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-300 bg-gray-50 dark:bg-gray-900
            ${showDetails ? 'w-[400px] lg:min-w-[350px]' : 'w-0 min-w-0'}
            md:absolute md:right-0 md:top-0 md:bottom-0 md:z-20 md:bg-white md:dark:bg-gray-950 md:shadow-lg
            ${showDetails ? 'md:translate-x-0 md:w-[280px]' : 'md:translate-x-full'}
            ${isTablet && showDetails ? 'md:hidden' : ''}
            lg:static lg:translate-x-0 lg:shadow-none`}
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
