'use client';

import { useEffect, useState } from 'react';
import { getUserInfo, setUserInfo } from '@/features/auth/auth.service';
import { PageHeader } from '@/components/ui/page-header';
import LogoutButton from '@/components/auth/LogoutButton';
import { ProfileDisplay } from '@/features/profile/components/profile-display';
import { EditProfileForm } from '@/features/profile/components/edit-profile-form';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
import { UserProfile } from '@/features/profile/models/profile.model';
import { profileService } from '@/features/profile/services/profile.service';
import { Skeleton } from '@/components/ui/radix-ui/skeleton';
import { Button } from '@/components/ui/radix-ui/button';
import { ArrowLeft } from 'lucide-react';
import { notification } from 'antd';

type ViewMode = 'view' | 'edit' | 'change-password';

/**
 * Trang hồ sơ người dùng
 * Hiển thị thông tin chi tiết của người dùng đã đăng nhập
 */
export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('view');

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
    setViewMode('view');

    // Update user info in storage
    setUserInfo(updatedUser.toStorageFormat());
  };

  const handlePasswordChangeSuccess = () => {
    setViewMode('view');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Hồ sơ người dùng"
          description="Xem và quản lý thông tin cá nhân của bạn"
        />
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
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
        {viewMode !== 'view' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('view')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        )}
        <PageHeader
          title={
            viewMode === 'edit'
              ? 'Chỉnh sửa hồ sơ'
              : viewMode === 'change-password'
              ? 'Đổi mật khẩu'
              : 'Hồ sơ người dùng'
          }
          description={
            viewMode === 'edit'
              ? 'Cập nhật thông tin cá nhân của bạn'
              : viewMode === 'change-password'
              ? 'Thay đổi mật khẩu tài khoản'
              : 'Xem và quản lý thông tin cá nhân của bạn'
          }
        />
      </div>

      {viewMode === 'view' && (
        <ProfileDisplay
          user={user}
          onEdit={() => setViewMode('edit')}
          onChangePassword={() => setViewMode('change-password')}
        />
      )}

      {viewMode === 'edit' && (
        <EditProfileForm
          user={user}
          onSuccess={handleEditSuccess}
          onCancel={() => setViewMode('view')}
        />
      )}

      {viewMode === 'change-password' && (
        <ChangePasswordForm
          userId={user.user_id}
          onSuccess={handlePasswordChangeSuccess}
          onCancel={() => setViewMode('view')}
        />
      )}

      {/* Logout Button - Always visible */}
      <div className="mt-8 flex justify-center">
        <LogoutButton className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
      </div>
    </div>
  );
}
