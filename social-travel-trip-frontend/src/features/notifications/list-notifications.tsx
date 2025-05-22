
'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/lib/providers/websocket.provider';
import { WebsocketEvent } from '@/lib/services/websocket.service';
import { Button, notification } from 'antd';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/radix-ui/dropdown-menu';
import { BellIcon, Loader2 } from 'lucide-react';
import { userService } from '../forum/services/user.service';
import { NotificationModel } from './models/notification.model';

/**
 * Component that displays a list of notifications
 */
export const ListNotifications = () => {
    const { on, off, isConnected } = useWebSocket();
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isConnected) {
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const notifications = await userService.getNotifications();
                setNotifications(notifications);
                setError(null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('Không thể tải dữ liệu thông báo');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isConnected]);

    // WebSocket event listeners
    useEffect(() => {
        if (!isConnected) {
            setLoading(false);
            return;
        }

        const handleNotificationCreated = (data: any) => {
            setNotifications(prev => [data, ...prev]);
        };

        on(WebsocketEvent.NOTIFICATION_CREATED, handleNotificationCreated);

        // Cleanup function
        return () => {
            off(WebsocketEvent.NOTIFICATION_CREATED, handleNotificationCreated);
        };
    }, [isConnected, on, off]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="dashed" size="small" className="relative">
                        <BellIcon className="h-5 w-5" />
                        <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-purple-500"></span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
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
                                <DropdownMenuItem key={notification.notify_id} className="p-3 cursor-pointer">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{notification.json_data.message}</p>
                                        <p className="text-xs text-muted-foreground">{notification.created_at}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                        <Button variant="dashed" className="w-full text-center">Xem tất cả</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
