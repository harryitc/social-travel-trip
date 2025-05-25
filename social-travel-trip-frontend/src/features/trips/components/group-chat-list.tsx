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
import { QRCodeDisplayDialog } from './qr-code-display-dialog';
import { InviteMemberDialog, InviteMemberData } from './invite-member-dialog';
import { GroupActionsMenu } from './group-actions-menu';
import { GroupCreatedSuccessDialog } from './group-created-success-dialog';
import { notification } from 'antd';
import { useEventStore } from '@/features/stores/event.store';
import { API_ENDPOINT } from '@/config/api.config';

type GroupChatListProps = {
  groups: TripGroup[];
  selectedGroupId: string;
  onSelectGroup: (group: TripGroup) => void;
};

export function GroupChatList({ groups, selectedGroupId, onSelectGroup }: GroupChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedGroupForActions, setSelectedGroupForActions] = useState<TripGroup | null>(null);
  const [createdGroup, setCreatedGroup] = useState<TripGroup | null>(null);
  const emit = useEventStore((state) => state.emit);

  const filteredGroups = groups.filter(group => {
    const title = group.title || group.name || '';
    const location = group.location || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateGroup = async (groupData: CreateTripGroupData) => {
    try {
      const result = await tripGroupService.createGroup(groupData);
      setShowCreateDialog(false);

      // Store created group and show success dialog
      setCreatedGroup(result);
      setShowSuccessDialog(true);

      // Emit event using Zustand
      emit('group:created', { group: result });
    } catch (error: any) {
      console.error('Error creating group:', error);

      // Show error notification
      notification.error({
        message: 'Lỗi tạo nhóm',
        description: error?.response?.data?.reasons?.message || error.message || 'Có lỗi xảy ra khi tạo nhóm',
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

      // Show success notification with proper group name
      const groupName = result.title || result.name || 'nhóm';
      notification.success({
        message: 'Tham gia nhóm thành công',
        description: `Bạn đã tham gia nhóm "${groupName}" thành công!`,
        placement: 'topRight',
        duration: 1.5,
      });

      // Emit event using Zustand
      emit('group:joined', { group: result });
    } catch (error: any) {
      console.error('Error joining group:', error);

      // Show error notification with better error handling
      let errorMessage = 'Có lỗi xảy ra khi tham gia nhóm';

      if (error.response?.data?.reasons?.message) {
        errorMessage = error.response.data.reasons.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      notification.error({
        message: 'Lỗi tham gia nhóm',
        description: errorMessage,
        placement: 'topRight',
        duration: 5,
      });
    }
  };

  const handleGenerateQRCode = async (groupId: string) => {
    return await tripGroupService.generateJoinCode(groupId);
  };

  const handleInviteMember = async (data: InviteMemberData) => {
    return await tripGroupService.inviteMember(data);
  };

  const openQRDialog = (group: TripGroup) => {
    setSelectedGroupForActions(group);
    setShowQRDialog(true);
  };

  const openInviteDialog = (group: TripGroup) => {
    setSelectedGroupForActions(group);
    setShowInviteDialog(true);
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
              <div
                key={group.id}
                className={`relative group/item rounded-xl transition-all duration-200 ${
                  group.id === selectedGroupId
                    ? 'bg-blue-50 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:border-blue-800'
                    : 'hover:bg-gray-50 border border-transparent dark:hover:bg-gray-800'
                }`}
              >
                <button
                  className="w-full flex items-center gap-3 p-3 text-left"
                  onClick={() => onSelectGroup(group)}
                >
                  <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white shadow-sm dark:ring-gray-800">
                    <AvatarImage src={API_ENDPOINT.file_image_v2 + group.image} alt={group.title} />
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

                {/* Group Actions Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <GroupActionsMenu
                    group={group}
                    onGenerateQR={openQRDialog}
                    onInviteMember={openInviteDialog}
                    currentUserId={1} // TODO: Get from auth context
                  />
                </div>
              </div>
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

      {selectedGroupForActions && (
        <>
          <QRCodeDisplayDialog
            open={showQRDialog}
            onOpenChange={setShowQRDialog}
            groupId={selectedGroupForActions.id}
            groupName={selectedGroupForActions.title}
            onGenerateQRCode={handleGenerateQRCode}
          />

          <InviteMemberDialog
            open={showInviteDialog}
            onOpenChange={setShowInviteDialog}
            groupId={selectedGroupForActions.id}
            groupName={selectedGroupForActions.title}
            onInviteMember={handleInviteMember}
          />
        </>
      )}

      {/* <GroupCreatedSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        group={createdGroup}
      /> */}
    </div>
  );
}
