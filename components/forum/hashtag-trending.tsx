'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { TrendingUp } from 'lucide-react';

export function HashtagTrending() {
  const trendingHashtags = [
    { tag: 'DuLichVietNam', posts: 1205 },
    { tag: 'PhuQuoc', posts: 954 },
    { tag: 'DaNang', posts: 862 },
    { tag: 'SaPa', posts: 743 },
    { tag: 'HaLong', posts: 628 },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400">
          <TrendingUp className="h-4 w-4 mr-2" />
          Xu hướng
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <h3 className="font-medium mb-2">Hashtag thịnh hành</h3>
          {trendingHashtags.map((item) => (
            <DropdownMenuItem key={item.tag} className="cursor-pointer">
              <div className="flex justify-between w-full">
                <span>#{item.tag}</span>
                <span className="text-muted-foreground text-xs">{item.posts} bài viết</span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}