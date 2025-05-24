'use client';

import { useState, useEffect } from 'react';
import { tripGroupService } from '../services/trip-group.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/radix-ui/dropdown-menu';
import {
  Search,
  MoreVertical,
  UserMinus,
  Crown,
  Shield,
  User,
  Edit3,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { notification } from 'antd';
import { getUserInfo } from '@/features/auth/auth.service';
import { GroupMember } from '../member-list-dialog';

interface MemberManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onMembersUpdated?: () => void;
}

export function MemberManagementDialog({
  open,
  onOpenChange,
  groupId,
  onMembersUpdated
}: MemberManagementDialogProps) {
  // Get current user info from auth
  const currentUser = getUserInfo();
  const currentUserId = currentUser?.user_id || currentUser?.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Edit nickname state
  const [editingNickname, setEditingNickname] = useState<number | null>(null);
  const [newNickname, setNewNickname] = useState('');

  const filteredMembers = searchQuery
    ? members.filter(member =>
        (member.username?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.nickname?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : members;

  // Load members when dialog opens
  useEffect(() => {
    if (open && groupId) {
      loadMembers();
    }
  }, [open, groupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await tripGroupService.getGroupMembers(groupId);
      if (response && response.members) {
        setMembers(response.members);
      }
    } catch (error: any) {
      console.error('Error loading members:', error);
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: 'Không thể tải danh sách thành viên',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKickMember = async (member: GroupMember) => {
    if (member.user_id === currentUserId) {
      notification.warning({
        message: 'Không thể thực hiện',
        description: 'Bạn không thể kick chính mình',
        placement: 'topRight',
      });
      return;
    }

    if (member.role === 'admin') {
      notification.warning({
        message: 'Không thể thực hiện',
        description: 'Không thể kick admin khỏi nhóm',
        placement: 'topRight',
      });
      return;
    }

    try {
      setActionLoading(member.user_id);

      await tripGroupService.kickMember({
        group_id: parseInt(groupId),
        user_id: member.user_id
      });

      notification.success({
        message: 'Thành công',
        description: `Đã kick ${member.nickname || member.username} khỏi nhóm`,
        placement: 'topRight',
      });

      // Reload members list
      await loadMembers();
      onMembersUpdated?.();

    } catch (error: any) {
      console.error('Error kicking member:', error);
      notification.error({
        message: 'Lỗi kick thành viên',
        description: error?.response?.data?.reasons?.message || 'Không thể kick thành viên',
        placement: 'topRight',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (member: GroupMember, newRole: string) => {
    if (member.user_id === currentUserId) {
      notification.warning({
        message: 'Không thể thực hiện',
        description: 'Bạn không thể thay đổi vai trò của chính mình',
        placement: 'topRight',
      });
      return;
    }

    try {
      setActionLoading(member.user_id);

      await tripGroupService.updateMemberRole({
        group_id: parseInt(groupId),
        user_id: member.user_id,
        role: newRole
      });

      notification.success({
        message: 'Thành công',
        description: `Đã thay đổi vai trò của ${member.nickname || member.username} thành ${getRoleDisplayName(newRole)}`,
        placement: 'topRight',
      });

      // Reload members list
      await loadMembers();
      onMembersUpdated?.();

    } catch (error: any) {
      console.error('Error changing role:', error);
      notification.error({
        message: 'Lỗi thay đổi vai trò',
        description: error?.response?.data?.reasons?.message || 'Không thể thay đổi vai trò',
        placement: 'topRight',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateNickname = async (member: GroupMember) => {
    try {
      setActionLoading(member.user_id);

      await tripGroupService.updateMemberNickname({
        group_id: parseInt(groupId),
        user_id: member.user_id,
        nickname: newNickname.trim() || undefined
      });

      notification.success({
        message: 'Thành công',
        description: 'Đã cập nhật nickname',
        placement: 'topRight',
      });

      // Reset editing state
      setEditingNickname(null);
      setNewNickname('');

      // Reload members list
      await loadMembers();
      onMembersUpdated?.();

    } catch (error: any) {
      console.error('Error updating nickname:', error);
      notification.error({
        message: 'Lỗi cập nhật nickname',
        description: error?.response?.data?.reasons?.message || 'Không thể cập nhật nickname',
        placement: 'topRight',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const startEditNickname = (member: GroupMember) => {
    setEditingNickname(member.user_id);
    setNewNickname(member.nickname || '');
  };

  const cancelEditNickname = () => {
    setEditingNickname(null);
    setNewNickname('');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      case 'member': return 'Thành viên';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'moderator': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const currentUserMember = members.find(m => m.user_id === currentUserId);
  const isCurrentUserAdmin = currentUserMember?.role === 'admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Quản lý thành viên
            <Badge variant="outline" className="ml-2">
              {members.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thành viên..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Members List */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Đang tải...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => {
                  const displayName = member.nickname || member.username || 'Unknown User';
                  const isCurrentUser = member.user_id === currentUserId;
                  const canManage = isCurrentUserAdmin && !isCurrentUser;

                  return (
                    <div
                      key={member.group_member_id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar_url} alt={displayName} />
                          <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {editingNickname === member.user_id ? (
                            <div className="space-y-2">
                              <Input
                                value={newNickname}
                                onChange={(e) => setNewNickname(e.target.value)}
                                placeholder="Nhập nickname..."
                                className="h-8"
                                disabled={actionLoading === member.user_id}
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateNickname(member)}
                                  disabled={actionLoading === member.user_id}
                                  className="h-6 px-2 text-xs"
                                >
                                  Lưu
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditNickname}
                                  disabled={actionLoading === member.user_id}
                                  className="h-6 px-2 text-xs"
                                >
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium text-sm truncate">{displayName}</div>
                              {member.username !== displayName && (
                                <div className="text-xs text-gray-500 truncate">
                                  @{member.username}
                                  {member.full_name && ` • ${member.full_name}`}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={member.role === 'admin' ? 'default' : 'outline'}
                            className="flex items-center gap-1"
                          >
                            {getRoleIcon(member.role)}
                            {getRoleDisplayName(member.role)}
                          </Badge>

                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">
                              Bạn
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions Menu */}
                      {canManage && editingNickname !== member.user_id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={actionLoading === member.user_id}
                            >
                              {actionLoading === member.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => startEditNickname(member)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Đổi nickname
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleChangeRole(member, 'admin')}
                              className="cursor-pointer"
                              disabled={member.role === 'admin'}
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Chuyển thành Admin
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleChangeRole(member, 'moderator')}
                              className="cursor-pointer"
                              disabled={member.role === 'moderator'}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Chuyển thành Moderator
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleChangeRole(member, 'member')}
                              className="cursor-pointer"
                              disabled={member.role === 'member'}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Chuyển thành Thành viên
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleKickMember(member)}
                              className="cursor-pointer text-red-600 hover:text-red-700"
                              disabled={member.role === 'admin'}
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              Kick khỏi nhóm
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
