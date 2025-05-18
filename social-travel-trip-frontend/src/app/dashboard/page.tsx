'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [authProvider, setAuthProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const picture = localStorage.getItem('user_picture');
    const provider = localStorage.getItem('auth_provider');

    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
      router.push('/auth/custom-auth');
    } else {
      setUserEmail(email);
      setUserName(name);
      setUserPicture(picture);
      setAuthProvider(provider);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_picture');
    localStorage.removeItem('auth_provider');

    // Chuyển hướng về trang chủ
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {authProvider === 'google' && userPicture ? (
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <img
                  src={userPicture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-primary/10 p-3 rounded-full">
                <UserCircle className="h-10 w-10 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">Xin chào!</h1>
              <p className="text-xl font-medium">{userName || 'Người dùng'}</p>
              <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
              {authProvider && (
                <div className="mt-1 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  Đăng nhập qua {authProvider === 'google' ? 'Google' : 'Email'}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Chuyến đi gần đây</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn chưa có chuyến đi nào. Hãy tạo chuyến đi mới!
          </p>
          <Button className="mt-4 w-full">Tạo chuyến đi</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Bạn bè</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Kết nối với bạn bè để cùng nhau khám phá những điểm đến mới.
          </p>
          <Button className="mt-4 w-full">Tìm bạn bè</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Khám phá</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Khám phá những điểm đến hấp dẫn và phổ biến nhất.
          </p>
          <Button className="mt-4 w-full">Khám phá ngay</Button>
        </div>
      </div>
    </div>
  );
}
