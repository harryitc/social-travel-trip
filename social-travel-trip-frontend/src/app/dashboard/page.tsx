'use client';

import { useEffect, useState } from 'react';
import { getUserInfo } from '@/features/auth/auth.service';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';

/**
 * Trang dashboard cho người dùng đã đăng nhập
 */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        const userInfo = getUserInfo();
        console.log('Dashboard page - userInfo:', userInfo);
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
          title="Bảng điều khiển"
          description="Quản lý tài khoản và hoạt động của bạn"
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Bạn chưa đăng nhập. Vui lòng đăng nhập để xem bảng điều khiển.
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/auth/sign-in?redirect=/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={`Xin chào, ${user.full_name || user.username}!`}
        description="Quản lý tài khoản và hoạt động của bạn"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Thông tin cá nhân</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Xem và cập nhật thông tin cá nhân của bạn
          </p>
          <Link
            href="/profile"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Xem hồ sơ &rarr;
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bài viết của tôi</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Quản lý các bài viết bạn đã đăng
          </p>
          <Link
            href="/my-posts"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Xem bài viết &rarr;
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Lịch trình của tôi</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Quản lý các lịch trình du lịch của bạn
          </p>
          <Link
            href="/my-schedules"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Xem lịch trình &rarr;
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hoạt động gần đây</h3>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Chưa có hoạt động nào gần đây.
          </p>
        </div>
      </div>
    </div>
  );
}
