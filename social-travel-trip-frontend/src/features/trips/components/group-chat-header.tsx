'use client';

import { TripBreadcrumb } from "./trip-breadcrumb";
import { ListNotifications } from "@/features/notifications/list-notifications";
import UserProfile from "@/components/auth/UserProfile";

export function GroupChatHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      {/* Left side - Breadcrumb */}
      <div className="flex-1">
        <TripBreadcrumb />
      </div>
      
      {/* Right side - Notifications and User Profile */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <ListNotifications />
        
        {/* User Profile */}
        <div className="flex gap-2">
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
