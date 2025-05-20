'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import { isLoggedIn } from '@/features/auth/auth.service';

/**
 * User profile component
 * Shows user avatar and dropdown menu with logout option
 */
export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isLoggedIn());
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <Image
            src="/images/default-avatar.png"
            alt="User avatar"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
          Tài khoản
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Người dùng</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
          </div>
          <div className="py-1">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Hồ sơ
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cài đặt
            </a>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <LogoutButton className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
