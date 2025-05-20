'use client';

import { useState, useEffect } from 'react';
import { getUserInfo } from '@/features/auth/auth.service';

/**
 * Component hiển thị lời chào mừng cho người dùng đã đăng nhập
 */
export default function UserWelcome() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Xin chào, {user.full_name || user.username}!
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Chào mừng bạn quay trở lại với Social Travel Trip. Hãy khám phá và chia sẻ những trải nghiệm du lịch tuyệt vời của bạn.
      </p>
      
      <div className="mt-4 flex flex-wrap gap-4">
        <a 
          href="/profile" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Xem hồ sơ
        </a>
        <a 
          href="/create-post" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tạo bài viết mới
        </a>
      </div>
    </div>
  );
}
