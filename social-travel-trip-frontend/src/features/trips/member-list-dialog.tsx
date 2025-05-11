'use client';

import { useState } from 'react';
import { TripMember } from './mock-trip-groups';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Search, UserPlus, X } from 'lucide-react';
import { Input } from '@/components/ui/radix-ui/input';

type MemberListDialogProps = {
  members: TripMember[];
  maxMembers: number;
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
};

export function MemberListDialog({ members, maxMembers, isOpen, onClose, onInvite }: MemberListDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = searchQuery
    ? members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Danh sách thành viên
            <Badge variant="outline" className="ml-2">
              {members.length}/{maxMembers}
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
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-purple-100 dark:border-purple-800">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    {member.role === 'admin' && (
                      <div className="text-xs text-muted-foreground">Quản trị viên</div>
                    )}
                  </div>
                </div>

                {member.role === 'admin' ? (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">
                    Thành viên
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {members.length < maxMembers && (
          <Button
            onClick={() => {
              onClose(); // Đóng dialog danh sách thành viên
              onInvite(); // Mở dialog mời thành viên
            }}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Mời thêm thành viên
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
