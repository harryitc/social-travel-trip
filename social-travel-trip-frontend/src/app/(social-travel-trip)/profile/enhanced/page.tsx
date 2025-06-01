'use client';

import { useEffect, useState } from 'react';
import {
  ProfileHeader,
  ProfileTabs,
  ProfileAbout,
  ProfileTimeline,
  ProfilePhotos,
  ProfileTravelStats,
  ProfileConnections,
  ProfileStatsCard,
  EditProfileForm,
  ChangePasswordForm,
  profileService,
  UserProfile
} from '@/features/profile';
import { useProfileStats, useProfileCompletion } from '@/features/profile/hooks/use-profile-stats';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Alert, AlertDescription } from '@/components/ui/radix-ui/alert';
import { 
  Edit, 
  Shield, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { notification } from 'antd';

type TabType = 'about' | 'timeline' | 'photos' | 'travel-stats' | 'connections';
type ViewMode = 'view' | 'edit' | 'change-password';

/**
 * Enhanced Profile Page with Real API Integration
 */
export default function EnhancedProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [viewMode, setViewMode] = useState<ViewMode>('view');

  // Use profile stats hook
  const { 
    profileData, 
    loading: statsLoading, 
    error: statsError, 
    refreshStats 
  } = useProfileStats({ 
    includeActivity: true, 
    autoRefresh: true,
    refreshInterval: 60000 // 1 minute
  });

  // Use profile completion hook
  const { calculateCompletion, getCompletionStatus, getMissingFields } = useProfileCompletion();

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await profileService.getCurrentUserProfile();
        setUser(new UserProfile(userData));
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin profile. Vui lòng thử lại.',
        });
        
        // Handle authentication errors
        if (error.status === 401 || error.status === 403) {
          window.location.href = '/auth/login';
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const tabs = [
    { id: 'about', label: 'Giới thiệu', icon: '👤' },
    { id: 'timeline', label: 'Hoạt động', icon: '📝' },
    { id: 'photos', label: 'Ảnh', icon: '📸' },
    { id: 'travel-stats', label: 'Thống kê du lịch', icon: '📊' },
    { id: 'connections', label: 'Kết nối', icon: '👥' }
  ];

  const handleProfileUpdate = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setViewMode('view');
    await refreshStats(); // Refresh stats after profile update
    
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật thông tin profile thành công!',
    });
  };

  const handlePasswordChange = () => {
    setViewMode('view');
    notification.success({
      message: 'Thành công',
      description: 'Đổi mật khẩu thành công!',
    });
  };

  const renderViewModeContent = () => {
    if (viewMode === 'edit' && user) {
      return (
        <EditProfileForm
          user={user}
          onSuccess={handleProfileUpdate}
          onCancel={() => setViewMode('view')}
        />
      );
    }

    if (viewMode === 'change-password' && user) {
      return (
        <ChangePasswordForm
          userId={user.user_id}
          onSuccess={handlePasswordChange}
          onCancel={() => setViewMode('view')}
        />
      );
    }

    return renderTabContent();
  };

  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'about':
        return <ProfileAbout user={user} />;
      case 'timeline':
        return <ProfileTimeline user={user} />;
      case 'photos':
        return <ProfilePhotos user={user} />;
      case 'travel-stats':
        return <ProfileTravelStats user={user} />;
      case 'connections':
        return <ProfileConnections user={user} />;
      default:
        return <ProfileAbout user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="animate-pulse">
          <div className="h-80 bg-gray-300 rounded-b-3xl"></div>
          <div className="container mx-auto px-4 -mt-20">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-64"></div>
                  <div className="h-4 bg-gray-300 rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không thể tải profile</h3>
            <p className="text-gray-600 mb-4">Có lỗi xảy ra khi tải thông tin profile của bạn.</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = calculateCompletion(user);
  const completionInfo = getCompletionStatus(completionPercentage);
  const missingFields = getMissingFields(user);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
    >
      {/* Profile Header */}
      <div className="relative">
        <ProfileHeader user={user} />
        
        {/* Action Buttons */}
        {viewMode === 'view' && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewMode('edit')}
              className="bg-white/90 hover:bg-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewMode('change-password')}
              className="bg-white/90 hover:bg-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Đổi mật khẩu
            </Button>
          </div>
        )}
      </div>

      {/* Profile Completion Alert */}
      {completionPercentage < 90 && viewMode === 'view' && (
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <Alert className="bg-orange-50 border-orange-200">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Hoàn thiện profile của bạn ({completionPercentage}%)</strong>
                  <p className="text-sm mt-1">
                    Còn thiếu: {missingFields.join(', ')}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setViewMode('edit')}
                  className="ml-4"
                >
                  Cập nhật ngay
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Stats */}
          <div className="lg:col-span-1">
            {profileData && !statsLoading ? (
              <ProfileStatsCard profileData={profileData} />
            ) : (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {statsError && (
              <Alert className="mt-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm">Không thể tải thống kê profile</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshStats}
                    className="mt-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Thử lại
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {viewMode === 'view' && (
              <>
                {/* Profile Navigation Tabs */}
                <ProfileTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={(tabId: string) => setActiveTab(tabId as TabType)}
                />

                {/* Tab Content */}
                <div className="mt-6">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </div>
              </>
            )}

            {/* Edit/Change Password Forms */}
            {(viewMode === 'edit' || viewMode === 'change-password') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderViewModeContent()}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
