'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { userService } from '../services/user.service';
import { notification } from 'antd';
import { getUserInfo } from '@/features/auth/auth.service';

interface FollowButtonProps {
  userId: string;
  username: string;
  fullName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  userId,
  username,
  fullName,
  variant = 'outline',
  size = 'sm',
  showIcon = true,
  className = '',
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const currentUser = getUserInfo();

  // Don't show follow button for current user
  if (currentUser?.userId?.toString() === userId?.toString()) {
    return null;
  }

  // Check follow status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { isFollowing: followStatus } = await userService.checkFollowStatus(userId);
        setIsFollowing(followStatus);
      } catch (error) {
        console.error('Error checking follow status:', error);
        setIsFollowing(false);
      } finally {
        setIsInitialized(true);
      }
    };

    if (userId) {
      checkStatus();
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    if (isLoading) return; // Prevent multiple clicks

    const previousStatus = isFollowing;
    const newFollowStatus = !isFollowing;

    try {
      setIsLoading(true);

      // Optimistic update
      setIsFollowing(newFollowStatus);

      if (previousStatus) {
        // Unfollow user
        await userService.unfollowUser(userId);

        notification.success({
          message: 'Bỏ theo dõi thành công',
          description: `Bạn đã bỏ theo dõi ${fullName || username}.`,
          placement: 'topRight',
        });
      } else {
        // Follow user
        await userService.followUser(userId);

        // notification.success({
        //   message: 'Theo dõi thành công',
        //   description: `Bạn đã bắt đầu theo dõi ${fullName || username}. Bạn sẽ nhận được thông báo khi họ đăng bài viết mới.`,
        //   placement: 'topRight',
        // });
      }

      // Notify parent component about the change with the new status
      onFollowChange?.(newFollowStatus);

    } catch (error: any) {
      console.error('Error toggling follow status:', error);

      // Revert optimistic update on error
      setIsFollowing(previousStatus);

      notification.error({
        message: 'Có lỗi xảy ra',
        description: error?.response?.data?.reasons?.message || `Không thể ${previousStatus ? 'bỏ theo dõi' : 'theo dõi'} ${fullName || username}. Vui lòng thử lại.`,
        placement: 'topRight',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`${className} ${
        isFollowing
          ? 'bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-300 hover:border-red-300'
          : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && (
            isFollowing ? (
              <UserMinus className="h-4 w-4 mr-1" />
            ) : (
              <UserPlus className="h-4 w-4 mr-1" />
            )
          )}
          {isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
        </>
      )}
    </Button>
  );
}
