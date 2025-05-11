'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import {
  MessageSquare,
  Calendar,
  Home,
  MemoryStick,
  Map,
  BookText,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { ModeToggle } from '@/components/ui/radix-ui/mode-toggle';
import { UserProfile } from './user-profile';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Diễn đàn',
    path: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: 'Chuyến đi',
    path: '/trips',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    name: 'Lập kế hoạch',
    path: '/planning',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: 'Khám phá',
    path: '/explore',
    icon: <Map className="h-5 w-5" />,
  },
  {
    name: 'Blog Mini',
    path: '/blog',
    icon: <BookText className="h-5 w-5" />,
  },
  {
    name: 'Memories',
    path: '/memories',
    icon: <MemoryStick className="h-5 w-5" />,
  },
  {
    name: 'Cài đặt',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-r border-purple-100 dark:border-purple-900 h-full w-64 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-purple-100 dark:border-purple-900">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-8 mr-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold">TT</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
              TripTribe
            </span>
          </Link>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {sidebarItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={pathname === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.path
                        ? "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 hover:text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/30"
                        : "text-gray-600 hover:bg-purple-500/10 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-purple-500/20 dark:hover:text-purple-400"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-purple-100 dark:border-purple-900">
            <UserProfile />
            <div className="mt-4 flex justify-end">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}