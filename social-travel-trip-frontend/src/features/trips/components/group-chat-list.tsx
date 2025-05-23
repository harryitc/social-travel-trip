'use client';

import { useState } from 'react';
import { TripGroup } from '../mock-trip-groups';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Search, Plus, QrCode, Users, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/radix-ui/badge';
import { CreateGroupDialog } from './create-group-dialog';
import { JoinGroupDialog } from './join-group-dialog';

type GroupChatListProps = {
  groups: TripGroup[];
  selectedGroupId: string;
  onSelectGroup: (group: TripGroup) => void;
};

export function GroupChatList({ groups, selectedGroupId, onSelectGroup }: GroupChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = (groupData: any) => {
    // TODO: Implement create group logic
    console.log('Creating group:', groupData);
    setShowCreateDialog(false);
  };

  const handleJoinGroup = (qrCode: string) => {
    // TODO: Implement join group logic
    console.log('Joining group with QR:', qrCode);
    setShowJoinDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with title and action buttons */}
      <div className="p-3 border-b border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-900/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-purple-800 dark:text-purple-300">Nhóm chuyến đi</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30"
              onClick={() => setShowJoinDialog(true)}
              title="Tham gia nhóm bằng QR"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30"
              onClick={() => setShowCreateDialog(true)}
              title="Tạo nhóm mới"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search bar - Always visible */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm nhóm..."
            className="pl-9 bg-secondary/50 focus-visible:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Group list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <button
                key={group.id}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors overflow-hidden ${
                  group.id === selectedGroupId
                    ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800'
                    : 'hover:bg-purple-50 dark:hover:bg-purple-900/10'
                }`}
                onClick={() => onSelectGroup(group)}
              >
                <Avatar className="h-12 w-12 shrink-0 border border-purple-100 dark:border-purple-800 shadow-sm">
                  <AvatarImage src={group.image} alt={group.title} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    {group.title[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-left overflow-hidden">
                  <div className="font-medium truncate text-sm mb-1">{group.title}</div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mb-1">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{group.members.count}/{group.members.max} thành viên</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{group.location}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {group.hasPlan && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] h-5 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      Có KH
                    </Badge>
                  )}
                  {group.isPrivate && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-[10px] h-5 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                      Riêng tư
                    </Badge>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <div className="mb-4">🔍</div>
              <h3 className="font-medium mb-2">Không tìm thấy nhóm nào</h3>
              <p className="text-sm mb-4">Thử tìm kiếm với từ khóa khác hoặc tạo nhóm mới</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400"
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
