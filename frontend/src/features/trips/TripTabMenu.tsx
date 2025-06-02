'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Calendar, View } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type TripTabMenuProps = {
  tripId: string;
  onTabChange?: (tabId: string) => void;
};

export function TripTabMenu({ tripId, onTabChange }: TripTabMenuProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('chat');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'forum',
      label: 'Diễn đàn',
      icon: <Home className="h-6 w-6" />,
      href: '/',
    },
    {
      id: 'chat',
      label: 'Chuyến đi',
      icon: <MessageSquare className="h-6 w-6" />,
      onClick: () => handleTabClick('chat'),
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
          tab.href ? (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors",
                tab.href === pathname
                  ? "text-teal-600 border-b-2 border-teal-600 dark:text-teal-400 dark:border-teal-400"
                  : "text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
              )}
            >
              <div className={cn(
                "p-1 rounded-full",
                tab.href === pathname
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-gray-500 dark:text-gray-400"
              )}>
                {tab.icon}
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          ) : (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "text-teal-600 border-b-2 border-teal-600 dark:text-teal-400 dark:border-teal-400"
                  : "text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
              )}
            >
              <div className={cn(
                "p-1 rounded-full",
                activeTab === tab.id
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-gray-500 dark:text-gray-400"
              )}>
                {tab.icon}
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
}
