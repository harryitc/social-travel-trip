'use client';

import { useState } from 'react';
import { TripGroup } from './mock-trip-groups';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Search, ArrowLeft, Users, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/radix-ui/badge';
import Link from 'next/link';

type GroupChatListProps = {
  groups: TripGroup[];
  selectedGroupId: string;
  onSelectGroup: (group: TripGroup) => void;
};

export function GroupChatList({ groups, selectedGroupId, onSelectGroup }: GroupChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="p-3 border-b border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-900/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/trips">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="font-semibold truncate">Nhóm của tôi</h2>
        </div>
        <Link href="/trips">
          <Button variant="ghost" size="sm" className="text-xs h-8 whitespace-nowrap text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20">
            Tất cả nhóm
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="p-3">
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
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors overflow-hidden ${
                group.id === selectedGroupId
                  ? 'bg-purple-100 dark:bg-purple-900/30'
                  : 'hover:bg-purple-50 dark:hover:bg-purple-900/10'
              }`}
              onClick={() => onSelectGroup(group)}
            >
              <Avatar className="h-9 w-9 shrink-0 border border-purple-100 dark:border-purple-800 shadow-xs">
                <AvatarImage src={group.image} alt={group.title} />
                <AvatarFallback>{group.title[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-left overflow-hidden">
                <div className="font-medium truncate text-sm">{group.title}</div>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5 max-w-full">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{group.members.count} thành viên</span>
                  <span className="mx-1 flex-shrink-0">•</span>
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{group.location.split(',')[0]}</span>
                </div>
              </div>

              {group.hasPlan && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] h-5 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex-shrink-0">
                  Có KH
                </Badge>
              )}
            </button>
          ))}

          {filteredGroups.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <div className="mb-2">🔍</div>
              <p>Không tìm thấy nhóm nào</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
