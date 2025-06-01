'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { AlertTriangle, LogOut, Loader2 } from 'lucide-react';
import { TripGroup } from '../models/trip-group.model';

interface LeaveGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: TripGroup | null;
  onConfirmLeave: (group: TripGroup) => Promise<void>;
}

export function LeaveGroupDialog({
  open,
  onOpenChange,
  group,
  onConfirmLeave
}: LeaveGroupDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    if (!group) return;

    try {
      setLoading(true);
      await onConfirmLeave(group);
      onOpenChange(false);
    } catch (error) {
      console.error('Error leaving group:', error);
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Rời khỏi nhóm
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hành động này không thể hoàn tác
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {group.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {group.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {group.members.count} thành viên
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn rời khỏi nhóm <strong>"{group.title}"</strong> không?
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Bạn sẽ không thể xem tin nhắn mới trong nhóm</p>
              <p>• Bạn cần được mời lại để tham gia nhóm</p>
              <p>• Lịch sử tin nhắn của bạn sẽ vẫn được giữ lại</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleLeave}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang rời...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Rời nhóm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
