'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Copy, QrCode, CheckCircle, Users, Share2 } from 'lucide-react';
import { notification } from 'antd';
import { TripGroup } from '../models/trip-group.model';

type GroupCreatedSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: TripGroup | null;
};

export function GroupCreatedSuccessDialog({ 
  open, 
  onOpenChange, 
  group 
}: GroupCreatedSuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyJoinCode = async () => {
    if (group?.join_code) {
      try {
        await navigator.clipboard.writeText(group.join_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        notification.success({
          message: 'Đã sao chép',
          description: 'Mã mời đã được sao chép vào clipboard',
          placement: 'topRight',
          duration: 2,
        });
      } catch (error) {
        notification.error({
          message: 'Lỗi sao chép',
          description: 'Không thể sao chép mã mời',
          placement: 'topRight',
          duration: 3,
        });
      }
    }
  };

  const shareGroup = async () => {
    if (group?.join_code) {
      const shareText = `🎉 Tham gia nhóm chuyến đi "${group.title}"!\n\nMã mời: ${group.join_code}\n\nSao chép mã này và dán vào ứng dụng để tham gia nhóm.`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Tham gia nhóm ${group.title}`,
            text: shareText,
          });
        } catch (error) {
          // User cancelled sharing or error occurred
          copyJoinCode();
        }
      } else {
        // Fallback to copying
        try {
          await navigator.clipboard.writeText(shareText);
          notification.success({
            message: 'Đã sao chép',
            description: 'Thông tin nhóm đã được sao chép để chia sẻ',
            placement: 'topRight',
            duration: 3,
          });
        } catch (error) {
          notification.error({
            message: 'Lỗi chia sẻ',
            description: 'Không thể chia sẻ thông tin nhóm',
            placement: 'topRight',
            duration: 3,
          });
        }
      }
    }
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            🎉 Tạo nhóm thành công!
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nhóm "{group.title}" đã được tạo thành công. Chia sẻ mã mời bên dưới để mời bạn bè tham gia.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{group.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
                {group.location && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">📍 {group.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Join Code Section */}
          {group.join_code && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-teal-500" />
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mã mời nhóm
                </Label>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={group.join_code}
                  readOnly
                  className="font-mono text-center tracking-wider bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 text-lg font-semibold"
                />
                <Button
                  onClick={copyJoinCode}
                  variant="outline"
                  size="sm"
                  className="px-3 border-teal-200 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-900/20"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chia sẻ mã này với bạn bè để họ có thể tham gia nhóm
                </p>
                <Button
                  onClick={shareGroup}
                  variant="outline"
                  className="w-full border-teal-200 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-900/20"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ thông tin nhóm
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => onOpenChange(false)}
              className="px-6 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
            >
              Hoàn thành
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
