'use client';

import { useState } from 'react';
import { SearchIcon, BellIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/radix-ui/dropdown-menu';
import { SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export function TopbarNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      <div className="flex-1 lg:ml-80 flex items-center">
        <form className="hidden md:flex items-center w-full max-w-md">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-9 bg-secondary/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <Button variant="ghost" size="icon" className="md:hidden">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-purple-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Trần Anh đã thích bài viết của bạn</p>
                  <p className="text-xs text-muted-foreground">5 phút trước</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Mình Linh đã bình luận về bài viết của bạn</p>
                  <p className="text-xs text-muted-foreground">30 phút trước</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bạn được mời tham gia chuyến đi "Khám phá Đà Lạt"</p>
                  <p className="text-xs text-muted-foreground">2 giờ trước</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Button variant="ghost" className="w-full text-center">Xem tất cả</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserButton afterSignOutUrl="/" />
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-2">
            <SignInButton>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
                Đăng nhập
              </Button>
            </SignInButton>
            <a href="/auth/custom-auth" className="hidden sm:block">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm whitespace-nowrap">
                Đăng nhập đơn giản
              </Button>
            </a>
          </div>
        </SignedOut>
      </div>
    </header>
  );
}