'use client';

import { useEffect, useState } from 'react';
import { getUserInfo } from '@/features/auth/auth.service';
import { PageHeader } from '@/components/ui/page-header';
import LogoutButton from '@/components/auth/LogoutButton';

/**
 * Trang hồ sơ người dùng
 * Hiển thị thông tin chi tiết của người dùng đã đăng nhập
 */
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        const userInfo = getUserInfo();
        console.log('Profile page - userInfo:', userInfo);
        setUser(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();

    // Lắng nghe sự kiện storage để cập nhật khi có thay đổi
    window.addEventListener('storage', fetchUserInfo);
    
    return () => {
      window.removeEventListener('storage', fetchUserInfo);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Hồ sơ người dùng"
          description="Xem và quản lý thông tin cá nhân của bạn"
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin hồ sơ.
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href="/auth/sign-in"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Hồ sơ người dùng"
        description="Xem và quản lý thông tin cá nhân của bạn"
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.full_name || user.username}
              </h2>
              
              {user.email && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {user.email}
                </p>
              )}
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tên đăng nhập
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID người dùng
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    {user.user_id || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="/settings"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Chỉnh sửa hồ sơ
                </a>
                
                <LogoutButton className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
