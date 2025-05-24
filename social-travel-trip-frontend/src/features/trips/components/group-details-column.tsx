'use client';

import { TripGroup } from '../models/trip-group.model';
import { GroupChatDetails } from '../GroupChatDetails';
import { Users } from 'lucide-react';

type GroupDetailsColumnProps = {
  selectedGroup: TripGroup | null;
};

/**
 * Component cột phải - Chi tiết nhóm
 *
 * Luồng:
 * - Khi selectedGroup = null -> Hiển thị empty state
 * - Khi selectedGroup != null -> Hiển thị GroupChatDetails với thông tin nhóm
 */
export function GroupDetailsColumn({ selectedGroup }: GroupDetailsColumnProps) {
  // Log để theo dõi luồng
  if (selectedGroup) {
    console.log('📋 GroupDetailsColumn: Showing details for group:', selectedGroup.id, selectedGroup.title);
  }

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
