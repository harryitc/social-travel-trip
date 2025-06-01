'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Calendar, View } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TabMenu() {
  const pathname = usePathname();

  const tabs = [
    {
      id: 'forum',
      label: 'Diễn đàn',
      icon: <Home className="h-6 w-6" />,
      href: '/',
    },
    {
      id: 'trips',
      label: 'Chuyến đi',
      icon: <MessageSquare className="h-6 w-6" />,
      href: '/trips',
    },
    {
      id: 'planning',
      label: 'Lập kế hoạch',
      icon: <Calendar className="h-6 w-6" />,
      href: '/planning',
    },
    {
      id: 'view360',
      label: 'View 360°',
      icon: <View className="h-6 w-6" />,
      href: '/view360',
    },
  ];

  return (
    <div className="hidden md:block lg:hidden sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-purple-100 dark:border-purple-900">
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors",
              (tab.href === pathname || (tab.href === '/' && pathname === '')) || 
              (tab.href !== '/' && pathname.startsWith(tab.href))
                ? "text-teal-600 border-b-2 border-teal-600 dark:text-teal-400 dark:border-teal-400"
                : "text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
            )}
          >
            <div className={cn(
              "p-1 rounded-full",
              (tab.href === pathname || (tab.href === '/' && pathname === '')) || 
              (tab.href !== '/' && pathname.startsWith(tab.href))
                ? "text-teal-600 dark:text-teal-400"
                : "text-gray-500 dark:text-gray-400"
            )}>
              {tab.icon}
            </div>
            <span className="mt-0.5">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
