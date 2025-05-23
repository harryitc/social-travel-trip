'use client';

import { TripGroup, TripGroupMember } from '../models/trip-group.model';
import { TripChat } from '../trip-chat';
import { Users, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/radix-ui/button';

type ChatColumnProps = {
  selectedGroup: TripGroup | null;
  onCreateGroup?: () => void;
  onSearchGroup?: () => void;
};

/**
 * Component cột giữa - Khu vực chat
 *
 * Luồng:
 * - Khi selectedGroup = null -> Hiển thị empty state
 * - Khi selectedGroup != null -> Render TripChat -> TripChat tự động load messages
 */
export function ChatColumn({ selectedGroup, onCreateGroup, onSearchGroup }: ChatColumnProps) {
  // Xử lý khi tạo nhóm mới từ empty state
  const handleCreateGroupFromEmpty = () => {
    if (onCreateGroup) {
      onCreateGroup();
    } else {
      // Trigger create group dialog từ GroupChatList component
      const createButton = document.querySelector('[data-create-group-trigger]') as HTMLButtonElement;
      if (createButton) {
        createButton.click();
      }
    }
  };

  // Xử lý khi tìm kiếm từ empty state
  const handleSearchFromEmpty = () => {
    if (onSearchGroup) {
      onSearchGroup();
    } else {
      // Focus vào search input
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  // Log để theo dõi luồng
  if (selectedGroup) {
    console.log('💬 ChatColumn: Loading messages for group:', selectedGroup.id, selectedGroup.title);
  }

  return (
    <div className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
      {selectedGroup ? (
        <TripChat
          tripId={selectedGroup.id}
          members={selectedGroup.members.list}
          isTablet={false}
        />
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
  );
}
