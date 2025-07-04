'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, Users, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/radix-ui/button';
import { TripGroup } from '../models/trip-group.model';
import { useEventListeners } from '@/features/stores/useEventListeners';
import { useGroupStore } from '@/features/stores/event.store';


export function TripBreadcrumb() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // Get group data from store
  const { groups, selectedGroupId } = useGroupStore();

  // Find the currently selected group from store
  const selectedGroup = groups.find(group => group.id === selectedGroupId) || null;

  // Extract group ID from URL if not in store
  const urlGroupId = pathname.match(/\/trips\/([^\/]+)/)?.[1];

  // Use URL group ID as fallback if store doesn't have selectedGroupId
  const currentGroupId = selectedGroupId || urlGroupId;
  const currentGroup = groups.find(group => group.id === currentGroupId) || selectedGroup;

  // Debug logging
  useEffect(() => {
    console.log('🍞 [TripBreadcrumb] State update:', {
      pathname,
      selectedGroupId,
      urlGroupId,
      currentGroupId,
      hasCurrentGroup: !!currentGroup,
      currentGroupTitle: currentGroup?.title,
      currentGroupMemberCount: currentGroup?.members.count,
      totalGroups: groups.length
    });
  }, [pathname, selectedGroupId, urlGroupId, currentGroupId, currentGroup, groups.length]);

  // Listen to group events (for real-time updates)
  useEventListeners({
    'group:selected': (data) => {
      console.log('🍞 [BreadcrumbDetailPage] Group selected event:', data.group.id, data.group.title);
      // No need to set local state - store will be updated
    },
    'group:updated': (data) => {
      console.log('🍞 [BreadcrumbDetailPage] Group updated event:', {
        title: data.group.title,
        memberCount: data.group.members.count,
        isCurrentGroup: currentGroup?.id === data.group.id
      });
      // No need to set local state - store will be updated
    },
  });

  const handleCopyUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        label: 'Trang chủ',
        href: '/',
        icon: Home,
      },
      {
        label: 'Chuyến đi',
        href: '/trips',
        icon: Users,
      },
    ];

    // Nếu có currentGroup và đang ở trang chi tiết
    if (currentGroup && pathname.includes('/trips/')) {
      items.push({
        label: `${currentGroup.title}`,
        href: `/trips/${currentGroup.id}`,
      } as any);
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="flex-1">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}

              {index === breadcrumbItems.length - 1 ? (
                // Current page - not clickable
                <span className="flex items-center gap-1 text-gray-900 dark:text-gray-100 font-medium">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </span>
              ) : (
                // Clickable breadcrumb
                <Link
                  href={item.href}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Copy URL button - only show when there's a current group */}
        {/* {currentGroup && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 ml-4"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-green-600" />
                Đã copy
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy link
              </>
            )}
          </Button>
        )} */}
      </nav>
    </div>
  );
}
