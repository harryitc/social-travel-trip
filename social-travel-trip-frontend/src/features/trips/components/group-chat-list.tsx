'use client';

import { useState } from 'react';
import { TripGroup, CreateTripGroupData, JoinTripGroupData } from '../models/trip-group.model';
import { tripGroupService } from '../services/trip-group.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Search, Plus, QrCode, Users, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/radix-ui/badge';
import { CreateGroupDialog } from './create-group-dialog';
import { JoinGroupDialog } from './join-group-dialog';
import { notification } from 'antd';

type GroupChatListProps = {
  groups: TripGroup[];
  selectedGroupId: string;
  onSelectGroup: (group: TripGroup) => void;
  onGroupCreated?: (group: TripGroup) => void;
  onGroupJoined?: (group: TripGroup) => void;
};

export function GroupChatList({ groups, selectedGroupId, onSelectGroup, onGroupCreated, onGroupJoined }: GroupChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const filteredGroups = groups.filter(group => {
    const title = group.title || group.name || '';
    const location = group.location || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateGroup = async (groupData: CreateTripGroupData) => {
    try {
      console.log('Creating group with data:', groupData.toBackendDTO());
      const result = await tripGroupService.createGroup(groupData);
      console.log('Group created successfully:', result);
      setShowCreateDialog(false);

      // Show success notification
      notification.success({
        message: 'Tạo nhóm thành công',
        description: `Nhóm "${result.title}" đã được tạo thành công!`,
        placement: 'topRight',
        duration: 3,
      });

      // Notify parent component
      if (onGroupCreated) {
        onGroupCreated(result);
      }
    } catch (error: any) {
      console.error('Error creating group:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Show error notification
      notification.error({
        message: 'Lỗi tạo nhóm',
        description: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo nhóm',
        placement: 'topRight',
        duration: 5,
      });
    }
  };

  const handleJoinGroup = async (qrCode: string) => {
    try {
      const joinData = new JoinTripGroupData({ qrCode });
      const result = await tripGroupService.joinGroup(joinData);
      setShowJoinDialog(false);

      // Show success notification
      notification.success({
        message: 'Tham gia nhóm thành công',
        description: `Bạn đã tham gia nhóm "${result.title}" thành công!`,
        placement: 'topRight',
        duration: 3,
      });

      // Notify parent component
      if (onGroupJoined) {
        onGroupJoined(result);
      }
    } catch (error: any) {
      console.error('Error joining group:', error);

      // Show error notification
      notification.error({
        message: 'Lỗi tham gia nhóm',
        description: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tham gia nhóm',
        placement: 'topRight',
        duration: 5,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header with title and action buttons */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nhóm chuyến đi</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => setShowJoinDialog(true)}
            >
              <QrCode className="h-3 w-3 mr-1" />
              Tham gia
            </Button>
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowCreateDialog(true)}
              data-create-group-trigger
            >
              <Plus className="h-3 w-3 mr-1" />
              Tạo nhóm
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm nhóm..."
            className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Group list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <button
                key={group.id}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                  group.id === selectedGroupId
                    ? 'bg-blue-50 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:border-blue-800'
                    : 'hover:bg-gray-50 border border-transparent dark:hover:bg-gray-800'
                }`}
                onClick={() => onSelectGroup(group)}
              >
                <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white shadow-sm dark:ring-gray-800">
                  <AvatarImage src={group.image} alt={group.title} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {(group.title || group.name || 'G')[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                      {group.title}
                    </h3>
                    <div className="flex gap-1 ml-2">
                      {group.hasPlan && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-[10px] h-5 px-1.5 dark:bg-green-900/30 dark:text-green-400">
                          KH
                        </Badge>
                      )}
                      {group.isPrivate && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0 text-[10px] h-5 px-1.5 dark:bg-orange-900/30 dark:text-orange-400">
                          Riêng tư
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{group.members.count}/{group.members.max}</span>
                    </div>
                    {group.location && (
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{group.getLocationShort()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Không tìm thấy nhóm nào</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                Thử tìm kiếm với từ khóa khác hoặc tạo nhóm mới để bắt đầu
              </p>
              <Button
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo nhóm mới
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateGroup={handleCreateGroup}
      />

      <JoinGroupDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        onJoinGroup={handleJoinGroup}
      />
    </div>
  );
}
