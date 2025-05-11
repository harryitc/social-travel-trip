'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Skeleton } from '../ui/radix-ui/skeleton';

export function UserProfile() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <UserButton />
      <div>
        <p className="text-sm font-medium">{user?.fullName || 'Người dùng'}</p>
        <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || ''}</p>
      </div>
    </div>
  );
}