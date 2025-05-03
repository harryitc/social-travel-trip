'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, UserPlus, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Member = {
  id: string;
  name: string;
  avatar: string;
};

type InviteMembersDialogProps = {
  tripId: string;
  currentMembers: Member[];
  maxMembers: number;
  onInvite: (newMembers: Member[]) => void;
  children?: React.ReactNode; // Add support for custom trigger button
  open?: boolean; // For controlled mode
  onOpenChange?: (open: boolean) => void; // For controlled mode
};

// Mock user data for search
const mockUsers = [
  { id: '4', name: 'Phạm Anh', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  { id: '5', name: 'Nguyễn Thảo', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  { id: '6', name: 'Trần Dũng', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  { id: '7', name: 'Lê Hương', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  { id: '8', name: 'Vũ Minh', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
];

export function InviteMembersDialog({
  tripId,
  currentMembers,
  maxMembers,
  onInvite,
  children,
  open,
  onOpenChange
}: InviteMembersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Member[]>([]);

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isDialogOpen = isControlled ? open : isOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const currentMemberIds = currentMembers.map(member => member.id);
  const availableSlots = maxMembers - currentMembers.length;

  // Filter users who are not already members and match search query
  const filteredUsers = mockUsers.filter(user =>
    !currentMemberIds.includes(user.id) &&
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: Member) => {
    if (selectedUsers.length < availableSlots) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleInvite = () => {
    if (selectedUsers.length > 0) {
      onInvite(selectedUsers);
      setSelectedUsers([]);

      // Đóng dialog
      if (isControlled) {
        onOpenChange(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog
      open={isControlled ? open : isOpen}
      onOpenChange={isControlled ? onOpenChange : setIsOpen}
    >
      {!isControlled && (
        <DialogTrigger asChild>
          {children || (
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Users className="h-4 w-4 mr-2" />
              Mời thêm thành viên
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mời thành viên</DialogTitle>
          <DialogDescription>
            Mời bạn bè tham gia chuyến đi của bạn. Còn {availableSlots} vị trí trống.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc ID người dùng"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                Đã chọn ({selectedUsers.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1 bg-secondary rounded-full pl-1 pr-2 py-1"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">
              Kết quả tìm kiếm
            </Label>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => {
                    const isSelected = selectedUsers.some(selected => selected.id === user.id);
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          isSelected ? 'bg-secondary' : 'hover:bg-secondary/50'
                        } cursor-pointer`}
                        onClick={() => !isSelected && handleSelectUser(user)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                          </div>
                        </div>

                        <Button
                          variant={isSelected ? "secondary" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isSelected}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {searchQuery ? 'Không tìm thấy người dùng' : 'Nhập tên để tìm kiếm'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (isControlled) {
                onOpenChange(false);
              } else {
                setIsOpen(false);
              }
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedUsers.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Mời {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
