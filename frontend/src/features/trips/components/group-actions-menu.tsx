'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/radix-ui/dropdown-menu';
import { MoreVertical, QrCode, UserPlus, Settings, LogOut } from 'lucide-react';
import { TripGroup } from '../models/trip-group.model';

interface GroupActionsMenuProps {
  group: TripGroup;
  onGenerateQR: (group: TripGroup) => void;
  onInviteMember: (group: TripGroup) => void;
  onLeaveGroup?: (group: TripGroup) => void;
  onGroupSettings?: (group: TripGroup) => void;
  currentUserId?: number;
}

export function GroupActionsMenu({
  group,
  onGenerateQR,
  onInviteMember,
  onLeaveGroup,
  onGroupSettings,
  currentUserId,
}: GroupActionsMenuProps) {
  const [open, setOpen] = useState(false);

  // Check if current user is admin or moderator
  const currentUserMember = group.members.list.find(
    member => member.user_id === currentUserId
  );
  const isAdminOrModerator = currentUserMember &&
    (currentUserMember.role === 'admin' || currentUserMember.role === 'moderator');
  const isAdmin = currentUserMember && currentUserMember.role === 'admin';

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Admin/Moderator actions */}
        {isAdminOrModerator && (
          <>
            <DropdownMenuItem
              onClick={() => handleAction(() => onGenerateQR(group))}
              className="cursor-pointer"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Tạo mã QR
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction(() => onInviteMember(group))}
              className="cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Mời thành viên
            </DropdownMenuItem>
            {onGroupSettings && (
              <DropdownMenuItem
                onClick={() => handleAction(() => onGroupSettings(group))}
                className="cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt nhóm
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Common actions */}
        {onLeaveGroup && !isAdmin && (
          <DropdownMenuItem
            onClick={() => handleAction(() => onLeaveGroup(group))}
            className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Rời khỏi nhóm
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
