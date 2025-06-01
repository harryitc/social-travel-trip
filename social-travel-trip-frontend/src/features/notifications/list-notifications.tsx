
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { WebsocketEvent, websocketService } from '@/lib/services/websocket.service';
import { Button, notification as antNotification, Badge, Avatar } from 'antd';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/radix-ui/dropdown-menu';
import { BellIcon, Loader2, CheckIcon, UserIcon, MessageSquareIcon, ThumbsUpIcon, UsersIcon } from 'lucide-react';
import { userService } from '../forum/services/user.service';
import { NotificationModel } from './models/notification.model';
import { notificationService, NotificationType } from './services/notification.service';
import { useRouter } from 'next/navigation';
import { getRelativeTime } from '@/lib/utils';

/**
 * Component that displays a list of notifications
 */
export const ListNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const notificationsInitialized = useRef(false);

    // Function to get notification icon based on type
    const getNotificationIcon = (type: string) => {
        // User related notifications
        if (type === NotificationType.NEW_FOLLOWER) {
            return <UserIcon className="h-4 w-4 text-blue-500" />;
        }

        // Group related notifications
        if (type === NotificationType.GROUP_INVITATION) {
            return <UsersIcon className="h-4 w-4 text-green-500" />;
        }

        // Comment related notifications
        if ([NotificationType.POST_COMMENT, NotificationType.COMMENT_REPLY,
        NotificationType.MINI_BLOG_COMMENT, NotificationType.MINI_BLOG_COMMENT_REPLY].includes(type as NotificationType)) {
            return <MessageSquareIcon className="h-4 w-4 text-orange-500" />;
        }

        // Like related notifications
        if ([NotificationType.POST_LIKE, NotificationType.POST_COMMENT_LIKE,
        NotificationType.MINI_BLOG_LIKE, NotificationType.MINI_BLOG_COMMENT_LIKE].includes(type as NotificationType)) {
            return <ThumbsUpIcon className="h-4 w-4 text-red-500" />;
        }

        // Default icon for other notifications
        return <BellIcon className="h-4 w-4 text-purple-500" />;
    };

    // Load notifications from API
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data);

            // Count unread notifications
            const unread = data.filter(notification => !notification.is_read).length;
            setUnreadCount(unread);

            setError(null);
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError('Không thể tải thông báo');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle new notification
    const handleNewNotification = useCallback((notification: NotificationModel) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
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
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            // Navigate to the relevant page
            // const url = notificationService.getNotificationUrl(notification);
            // if (url !== '#') {
            //     router.push(url);
            // }

            // Close dropdown
            // setIsOpen(false);
        } catch (err) {
            console.error('Error handling notification click:', err);
        }
    };

    // Handle notification action (Accept/Decline)
    const handleNotificationAction = async (action: any, notification: NotificationModel, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent notification click

        try {
            console.log('🎯 Handling notification action:', action);

            const result = await notificationService.handleNotificationAction(action);
            console.log('✅ Action result:', result);

            // Show success message
            antNotification.success({
                message: 'Thành công',
                description: result.message || `${action.label} thành công`,
                placement: 'topRight',
                duration: 3,
            });

            // Remove the notification from list after action
            setNotifications(prev =>
                prev.filter(item => item.notify_id !== notification.notify_id)
            );

            // Update unread count if notification was unread
            if (!notification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

        } catch (err: any) {
            console.error('❌ Error handling notification action:', err);
            antNotification.error({
                message: 'Lỗi',
                description: err.response?.data?.message || `Không thể ${action.label.toLowerCase()}`,
                placement: 'topRight',
                duration: 5,
            });
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
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    // Initialize WebSocket listeners and load notifications
    useEffect(() => {
        loadNotifications();

        // Setup WebSocket listener for new notifications
        const handleWebSocketNotification = (data: any) => {
            console.log('🔔 Notification List: Received WebSocket notification:', data);
            const notification = new NotificationModel(data);
            handleNewNotification(notification);
        };

        // Setup WebSocket listener for new notifications
        console.log('🔔 Notification List: Setting up WebSocket listener...');

        // Add listener first
        websocketService.on(WebsocketEvent.NOTIFICATION_CREATED, handleWebSocketNotification);
        console.log('🔔 Notification List: WebSocket listener added for NOTIFICATION_CREATED');

        // Connect WebSocket
        websocketService.connect().then(() => {
            console.log('🔔 Notification List: WebSocket connected successfully');
            const debugInfo = websocketService.getDebugInfo();
            console.log('🔔 Notification List: WebSocket debug info:', debugInfo);
        }).catch(error => {
            console.error('🔔 Notification List: WebSocket connection failed:', error);
        });

        // Cleanup WebSocket listener
        return () => {
            console.log('🔔 Notification List: Cleaning up WebSocket listener');
            websocketService.off(WebsocketEvent.NOTIFICATION_CREATED, handleWebSocketNotification);
        };
    }, [loadNotifications, handleNewNotification]);

    // Refresh notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen, loadNotifications]);

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="dashed" size="small" className="relative">
                        <BellIcon className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge count={unreadCount} size="small" className="!absolute -top-1 -right-1" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-3 py-2">
                        <DropdownMenuLabel className="p-0">Thông báo</DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                type="text"
                                className="text-xs flex items-center gap-1"
                                onClick={markAllAsRead}
                            >
                                <CheckIcon className="h-3 w-3" />
                                Đánh dấu đã đọc
                            </Button>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-2 text-sm text-muted-foreground">
                                {error}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-2 text-sm text-muted-foreground">
                                Không có thông báo nào
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <DropdownMenuItem
                                    key={notification.notify_id}
                                    className={`p-3 cursor-pointer ${!notification.is_read ? '' : 'opacity-50'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex flex-col space-y-1 flex-grow">
                                            <p className={`text-sm ${!notification.is_read ? 'font-medium' : ''}`}>
                                                {notificationService.getFormattedMessage(notification)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {getRelativeTime(notification.created_at)}
                                            </p>

                                            {/* Action buttons for group invitations */}
                                            {notificationService.hasActions(notification) && (
                                                <div className="flex gap-2 mt-2">
                                                    {notificationService.getActions(notification).map((action, index) => (
                                                        <Button
                                                            key={index}
                                                            size="small"
                                                            type={action.type === 'accept' ? 'primary' : 'default'}
                                                            className={action.type === 'accept' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
                                                            onClick={(e) => handleNotificationAction(action, notification, e)}
                                                        >
                                                            {action.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {!notification.is_read && (
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                        <Button
                            variant="dashed"
                            className="w-full text-center"
                            onClick={() => router.push('/notifications')}
                        >
                            Xem tất cả
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
