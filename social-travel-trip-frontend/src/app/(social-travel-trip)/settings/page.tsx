'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo, setUserInfo } from '@/features/auth/auth.service';
import { PageHeader } from '@/components/ui/page-header';
import { EditProfileForm } from '@/features/profile/components/edit-profile-form';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
import { UserProfile } from '@/features/profile/models/profile.model';
import { profileService } from '@/features/profile/services/profile.service';
import { Skeleton } from '@/components/ui/radix-ui/skeleton';
import { Button } from '@/components/ui/radix-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { ArrowLeft, User, Lock } from 'lucide-react';
import { notification } from 'antd';

/**
 * Trang cài đặt tài khoản
 * Cho phép người dùng chỉnh sửa thông tin cá nhân và đổi mật khẩu
 */
export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Try to get user from API first
      try {
        const profileData = await profileService.getCurrentUserProfile();
        setUser(new UserProfile(profileData));
      } catch (apiError) {
        // Fallback to local storage if API fails
        console.warn('API failed, using local storage:', apiError);
        const userInfo = getUserInfo();
        if (userInfo) {
          setUser(new UserProfile({
            user_id: userInfo.user_id || 0,
            username: userInfo.username || '',
            full_name: userInfo.full_name || '',
            email: userInfo.email || '',
            avatar_url: userInfo.avatar_url || '',
            ...userInfo
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin hồ sơ'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);

    // Update user info in storage
    setUserInfo(updatedUser.toStorageFormat());

    notification.success({
      message: 'Thành công',
      description: 'Cập nhật thông tin thành công!'
    });
  };

  const handlePasswordChangeSuccess = () => {
    notification.success({
      message: 'Thành công',
      description: 'Đổi mật khẩu thành công!'
    });
  };

  const handleBackToProfile = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToProfile}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại hồ sơ
          </Button>
          <PageHeader
            title="Cài đặt tài khoản"
            description="Quản lý thông tin cá nhân và bảo mật"
          />
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToProfile}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại hồ sơ
          </Button>
          <PageHeader
            title="Cài đặt tài khoản"
            description="Quản lý thông tin cá nhân và bảo mật"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Không thể tải thông tin người dùng. Vui lòng thử lại sau.
            </p>
            <Button
              onClick={fetchUserProfile}
              className="mt-4"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToProfile}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại hồ sơ
        </Button>
        <PageHeader
          title="Cài đặt tài khoản"
          description="Quản lý thông tin cá nhân và bảo mật"
        />
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <EditProfileForm
            user={user}
            onSuccess={handleEditSuccess}
          />
        </TabsContent>

        <TabsContent value="security">
          <ChangePasswordForm
            userId={user.user_id}
            onSuccess={handlePasswordChangeSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}