'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, Users, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/radix-ui/button';
import { TripGroup } from '../models/trip-group.model';

type TripBreadcrumbProps = {
  selectedGroup?: TripGroup | null;
};

export function TripBreadcrumb({ selectedGroup }: TripBreadcrumbProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

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

    // Nếu có selectedGroup và đang ở trang chi tiết
    if (selectedGroup && pathname.includes('/trips/')) {
      items.push({
        label: selectedGroup.title,
        href: `/trips/${selectedGroup.id}`,
      } as any);
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center justify-between mb-4">
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

      {/* Copy URL button - only show when there's a selected group */}
      {selectedGroup && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyUrl}
          className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
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
      )}
    </nav>
  );
}
