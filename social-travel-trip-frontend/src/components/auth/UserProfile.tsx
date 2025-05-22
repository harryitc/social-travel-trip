'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { isLoggedIn, getUserInfo } from '@/features/auth/auth.service';

/**
 * User profile component
 * Shows user avatar and dropdown menu with logout option
 */
export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isLoggedIn();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userInfo = getUserInfo();
        setUser(userInfo);
      }
    };

    checkAuth();

    // Kiểm tra lại khi component được mount
    window.addEventListener('storage', checkAuth);

    // Thêm interval để kiểm tra định kỳ (cho mục đích debug)
    const interval = setInterval(checkAuth, 2000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/auth/sign-in"
        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.username || 'User avatar'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.full_name || user.username || 'Tài khoản'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.full_name || user.username}
            </p>
            {user.email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            )}
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Hồ sơ
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cài đặt
            </Link>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <LogoutButton className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
