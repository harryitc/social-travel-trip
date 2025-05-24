'use client';

import { useState } from 'react';
import { tripGroupService } from '../services/trip-group.service';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Edit3, Loader2 } from 'lucide-react';
import { notification } from 'antd';

interface NicknameEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  currentUserId: number;
  currentNickname?: string;
  onNicknameUpdated?: () => void;
}

export function NicknameEditDialog({
  open,
  onOpenChange,
  groupId,
  currentUserId,
  currentNickname = '',
  onNicknameUpdated
}: NicknameEditDialogProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [loading, setLoading] = useState(false);

  const handleUpdateNickname = async () => {
    try {
      setLoading(true);
      
      await tripGroupService.updateMemberNickname({
        group_id: parseInt(groupId),
        user_id: currentUserId,
        nickname: nickname.trim() || undefined
      });

      notification.success({
        message: 'Thành công',
        description: 'Đã cập nhật nickname của bạn',
        placement: 'topRight',
      });

      onNicknameUpdated?.();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error updating nickname:', error);
      notification.error({
        message: 'Lỗi cập nhật nickname',
        description: error?.response?.data?.reasons?.message || 'Không thể cập nhật nickname',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNickname(currentNickname);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Đổi nickname
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname mới</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nhập nickname mới..."
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Để trống để sử dụng username làm tên hiển thị
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateNickname}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
