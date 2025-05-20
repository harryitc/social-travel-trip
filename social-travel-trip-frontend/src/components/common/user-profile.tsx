'use client';

// import { UserButton, useUser } from '@clerk/nextjs';
import { Skeleton } from '../ui/radix-ui/skeleton';

export function UserProfile() {
  // const { isLoaded, user } = useUser();
  const user = {
    fullName: 'Đức Anh',
    imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    email: 'ducanh@gmail.com',
  }

  // if (!isLoaded) {
  //   return (
  //     <div className="flex items-center space-x-3">
  //       <Skeleton className="h-10 w-10 rounded-full" />
  //       <div className="space-y-2">
  //         <Skeleton className="h-4 w-24" />
  //         <Skeleton className="h-3 w-16" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center space-x-3">
      {/* <UserButton /> */}
      <div>
        <p className="text-sm font-medium">{user?.fullName || 'Người dùng'}</p>
        <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
      </div>
    </div>
  );
}