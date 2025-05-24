'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Search, UserPlus, X, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/radix-ui/input';
import { tripGroupService } from './services/trip-group.service';
import { notification } from 'antd';

export interface GroupMember {
  group_member_id: number;
  group_id: number;
  user_id: number;
  nickname?: string;
  role: string;
  join_at: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

type MemberListDialogProps = {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
};

export function MemberListDialog({ groupId, isOpen, onClose, onInvite }: MemberListDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const filteredMembers = searchQuery
    ? members.filter(member =>
        (member.username?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.nickname?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : members;

  // Load members when dialog opens
  useEffect(() => {
    if (isOpen && groupId) {
      loadMembers();
    }
  }, [isOpen, groupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await tripGroupService.getGroupMembers(groupId, 1, 50);
      setMembers(response.data || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Error loading group members:', error);
      notification.error({
        message: 'Lỗi tải danh sách thành viên',
        description: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải danh sách thành viên',
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Danh sách thành viên
            <Badge variant="outline" className="ml-2">
              {members.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thành viên..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải danh sách thành viên...</span>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'Không tìm thấy thành viên nào' : 'Chưa có thành viên nào'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div
                  key={member.group_member_id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-purple-100 dark:border-purple-800">
                      <AvatarImage src={member.avatar_url} alt={member.username} />
                      <AvatarFallback>
                        {member.full_name?.[0] || member.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {member.nickname || member.full_name || member.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{member.username}
                        {member.nickname && member.full_name && (
                          <span> • {member.full_name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {member.role === 'admin' ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                      Admin
                    </Badge>
                  ) : member.role === 'moderator' ? (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                      Điều hành
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">
                      Thành viên
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Button
          onClick={() => {
            onClose(); // Đóng dialog danh sách thành viên
            onInvite(); // Mở dialog mời thành viên
          }}
          className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
          disabled={loading}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Mời thêm thành viên
        </Button>
      </DialogContent>
    </Dialog>
  );
}
