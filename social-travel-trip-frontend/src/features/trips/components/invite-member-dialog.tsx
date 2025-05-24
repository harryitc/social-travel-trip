'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Label } from '@/components/ui/radix-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';
import { UserPlus } from 'lucide-react';
import { Input, notification } from 'antd';
import { UserAutocomplete } from './user-autocomplete';
import { UserSearchResult } from '../services/user-search.service';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  onInviteMember: (data: InviteMemberData) => Promise<any>;
}

export interface InviteMemberData {
  groupId: string;
  usernameOrEmail: string;
  role: string;
  nickname?: string;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  groupId,
  groupName,
  onInviteMember
}: InviteMemberDialogProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [role, setRole] = useState('member');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameOrEmail.trim()) {
      notification.warning({
        message: 'Thiếu thông tin',
        description: 'Vui lòng nhập username hoặc email của người muốn mời',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);

      const inviteData: InviteMemberData = {
        groupId,
        usernameOrEmail: usernameOrEmail.trim(),
        role,
        nickname: nickname.trim() || undefined,
      };

      const result = await onInviteMember(inviteData);

      // Reset form
      setUsernameOrEmail('');
      setRole('member');
      setNickname('');
      onOpenChange(false);

      notification.success({
        message: 'Mời thành viên thành công',
        description: `Đã mời ${result.invited_user?.username || selectedUser?.username || usernameOrEmail} tham gia nhóm "${groupName}"`,
        placement: 'topRight',
        duration: 4,
      });
    } catch (error: any) {
      console.error('Error inviting member:', error);

      notification.error({
        message: 'Lỗi mời thành viên',
        description: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi mời thành viên',
        placement: 'topRight',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: UserSearchResult) => {
    setSelectedUser(user);
    // Auto-fill nickname with full name if available
    if (user.full_name && !nickname) {
      setNickname(user.full_name);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUsernameOrEmail('');
      setRole('member');
      setNickname('');
      setSelectedUser(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-600" />
            Mời thành viên
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mời người dùng tham gia nhóm "{groupName}" bằng username hoặc email
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username or Email with Autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="usernameOrEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username hoặc Email *
            </Label>
            <UserAutocomplete
              value={usernameOrEmail}
              onChange={setUsernameOrEmail}
              onUserSelect={handleUserSelect}
              placeholder="Nhập username hoặc email để tìm kiếm"
              disabled={loading}
              className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Bắt đầu nhập để tìm kiếm người dùng. Chọn từ danh sách gợi ý hoặc nhập trực tiếp username/email.
            </p>
            {selectedUser && (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-800 dark:text-green-200">
                  Đã chọn: {selectedUser.full_name || selectedUser.username} (@{selectedUser.username})
                </span>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vai trò trong nhóm
            </Label>
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 dark:border-gray-600">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Thành viên</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Điều hành viên</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role === 'member'
                ? 'Thành viên có thể tham gia trò chuyện và xem thông tin nhóm'
                : 'Điều hành viên có thể quản lý thành viên và tin nhắn'
              }
            </p>
          </div>

          {/* Nickname (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Biệt danh trong nhóm (tùy chọn)
            </Label>
            <Input
              id="nickname"
              placeholder="Ví dụ: Hướng dẫn viên, Nhiếp ảnh gia..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 dark:border-gray-600"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Biệt danh sẽ hiển thị thay cho tên thật trong nhóm này
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !usernameOrEmail.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang mời...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Gửi lời mời
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Lưu ý:</strong> Người được mời sẽ tự động được thêm vào nhóm và nhận thông báo về việc tham gia.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
