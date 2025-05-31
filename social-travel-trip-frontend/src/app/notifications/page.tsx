'use client';

import { useEffect, useState, useCallback } from 'react';
import { notificationService, NotificationType } from '@/features/notifications/services/notification.service';
import { NotificationModel } from '@/features/notifications/models/notification.model';
import { Card, Button, Spin, Empty, List, Typography, Badge } from 'antd';
import { UserIcon, MessageSquareIcon, ThumbsUpIcon, UsersIcon, BellIcon, CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

/**
 * Notifications page component
 */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    // User related notifications
    if (type === NotificationType.NEW_FOLLOWER) {
      return <UserIcon className="h-5 w-5 text-blue-500" />;
    }
    
    // Group related notifications
    if (type === NotificationType.GROUP_INVITATION) {
      return <UsersIcon className="h-5 w-5 text-green-500" />;
    }
    
    // Comment related notifications
    if ([NotificationType.POST_COMMENT, NotificationType.COMMENT_REPLY, 
         NotificationType.MINI_BLOG_COMMENT, NotificationType.MINI_BLOG_COMMENT_REPLY].includes(type as NotificationType)) {
      return <MessageSquareIcon className="h-5 w-5 text-orange-500" />;
    }
    
    // Like related notifications
    if ([NotificationType.POST_LIKE, NotificationType.POST_COMMENT_LIKE,
         NotificationType.MINI_BLOG_LIKE, NotificationType.MINI_BLOG_COMMENT_LIKE].includes(type as NotificationType)) {
      return <ThumbsUpIcon className="h-5 w-5 text-red-500" />;
    }
    
    // Default icon for other notifications
    return <BellIcon className="h-5 w-5 text-purple-500" />;
  };

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle notification click
  const handleNotificationClick = async (notification: NotificationModel) => {
    try {
      // Mark as read if not already read
      if (!notification.is_read) {
        await notificationService.markAsRead(notification.notify_id);
        
        // Update local state
        setNotifications(prev => 
          prev.map(item => 
            item.notify_id === notification.notify_id 
              ? { ...item, is_read: true } 
              : item
          )
        );
      }
      
      // Navigate to the relevant page
      const url = notificationService.getNotificationUrl(notification);
      if (url !== '#') {
        router.push(url);
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => ({ ...item, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="m-0">Thông báo của bạn</Title>
          {unreadCount > 0 && (
            <Button 
              type="primary" 
              className="flex items-center gap-1"
              onClick={markAllAsRead}
            >
              <CheckIcon className="h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Text type="danger">{error}</Text>
          </div>
        ) : notifications.length === 0 ? (
          <Empty description="Không có thông báo nào" />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item 
                key={notification.notify_id}
                className={`cursor-pointer p-4 rounded-md transition-colors ${!notification.is_read ? 'bg-purple-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {getNotificationIcon(notification.type)}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span className={!notification.is_read ? 'font-medium' : ''}>
                        {notificationService.getFormattedMessage(notification)}
                      </span>
                      {!notification.is_read && (
                        <Badge status="processing" color="purple" />
                      )}
                    </div>
                  }
                  description={
                    <Text type="secondary">
                      {new Date(notification.created_at).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </Text>
                  }
                />
              </List.Item>
            )}
            pagination={{
              pageSize: 10,
              position: 'bottom',
              align: 'center',
            }}
          />
        )}
      </Card>
    </div>
  );
}
