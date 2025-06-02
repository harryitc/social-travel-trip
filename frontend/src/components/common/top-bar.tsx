'use client';

import UserProfile from '@/components/auth/UserProfile';
import { ListNotifications } from '@/features/notifications/list-notifications';

export function TopbarNav() {

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">

      <div className='flex-1'></div>

      <div className="flex items-center space-x-2">

          <ListNotifications />

        <div className="flex gap-2">
          {/* Component hiển thị thông tin người dùng hoặc nút đăng nhập */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}