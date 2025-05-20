'use client';

import { logoutService } from '@/features/auth/auth.service';

/**
 * Logout button component
 * @param props Component props
 * @param props.className Additional CSS classes
 */
export default function LogoutButton({ className = '' }: { className?: string }) {
  const handleLogout = () => {
    logoutService();
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${className}`}
    >
      Đăng xuất
    </button>
  );
}
