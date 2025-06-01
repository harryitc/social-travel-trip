'use client';

import { useState, useEffect, useCallback } from 'react';
import { profileService, UserProfileWithStats } from '../services/profile.service';
import { notification } from 'antd';

interface UseProfileStatsOptions {
  includeActivity?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseProfileStatsReturn {
  profileData: UserProfileWithStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  recordView: (profileOwnerId: number) => Promise<void>;
}

export function useProfileStats(options: UseProfileStatsOptions = {}): UseProfileStatsReturn {
  const {
    includeActivity = false,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const [profileData, setProfileData] = useState<UserProfileWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await profileService.getProfileStats(includeActivity);
      setProfileData(data);
    } catch (err: any) {
      console.error('Error fetching profile stats:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải thống kê profile');
      
      // Handle authentication errors
      if (err.status === 401 || err.status === 403) {
        notification.error({
          message: 'Phiên đăng nhập hết hạn',
          description: 'Vui lòng đăng nhập lại để tiếp tục',
        });
        // Redirect to login page
        window.location.href = '/auth/login';
      }
    } finally {
      setLoading(false);
    }
  }, [includeActivity]);

  const refreshStats = useCallback(async () => {
    await fetchProfileStats();
  }, [fetchProfileStats]);

  const recordView = useCallback(async (profileOwnerId: number) => {
    try {
      await profileService.recordProfileView(profileOwnerId);
      // Optionally refresh stats after recording view
      if (profileData && profileData.user.user_id === profileOwnerId) {
        await refreshStats();
      }
    } catch (err: any) {
      console.error('Error recording profile view:', err);
      // Don't show error notification for view recording as it's not critical
    }
  }, [profileData, refreshStats]);

  // Initial fetch
  useEffect(() => {
    fetchProfileStats();
  }, [fetchProfileStats]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchProfileStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchProfileStats]);

  return {
    profileData,
    loading,
    error,
    refreshStats,
    recordView,
  };
}

// Hook for viewing other user's profile
export function useViewProfile(userId?: number) {
  const [profileData, setProfileData] = useState<UserProfileWithStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewProfile = useCallback(async (targetUserId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Record the profile view
      await profileService.recordProfileView(targetUserId);
      
      // Get profile stats for the target user
      const data = await profileService.getProfileStats(true);
      setProfileData(data);
    } catch (err: any) {
      console.error('Error viewing profile:', err);
      setError(err.message || 'Có lỗi xảy ra khi xem profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      viewProfile(userId);
    }
  }, [userId, viewProfile]);

  return {
    profileData,
    loading,
    error,
    viewProfile,
  };
}

// Hook for profile completion tracking
export function useProfileCompletion() {
  const calculateCompletion = useCallback((userData: any) => {
    const fields = [
      userData.full_name,
      userData.email,
      userData.phone_number,
      userData.date_of_birth,
      userData.gender !== undefined && userData.gender !== null,
      userData.address,
      userData.avatar_url
    ];

    const completedFields = fields.filter(field => !!field).length;
    return Math.round((completedFields / fields.length) * 100);
  }, []);

  const getCompletionStatus = useCallback((percentage: number) => {
    if (percentage >= 90) return { status: 'Hoàn thiện', color: 'green' };
    if (percentage >= 70) return { status: 'Gần hoàn thiện', color: 'blue' };
    if (percentage >= 50) return { status: 'Trung bình', color: 'orange' };
    return { status: 'Cần cập nhật', color: 'red' };
  }, []);

  const getMissingFields = useCallback((userData: any) => {
    const fieldLabels = {
      full_name: 'Họ tên',
      email: 'Email',
      phone_number: 'Số điện thoại',
      date_of_birth: 'Ngày sinh',
      gender: 'Giới tính',
      address: 'Địa chỉ',
      avatar_url: 'Ảnh đại diện'
    };

    const missingFields = [];
    
    if (!userData.full_name) missingFields.push(fieldLabels.full_name);
    if (!userData.email) missingFields.push(fieldLabels.email);
    if (!userData.phone_number) missingFields.push(fieldLabels.phone_number);
    if (!userData.date_of_birth) missingFields.push(fieldLabels.date_of_birth);
    if (userData.gender === undefined || userData.gender === null) missingFields.push(fieldLabels.gender);
    if (!userData.address) missingFields.push(fieldLabels.address);
    if (!userData.avatar_url) missingFields.push(fieldLabels.avatar_url);

    return missingFields;
  }, []);

  return {
    calculateCompletion,
    getCompletionStatus,
    getMissingFields,
  };
}
