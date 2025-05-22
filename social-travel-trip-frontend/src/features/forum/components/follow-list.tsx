'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Loader2, Users, UserCheck } from 'lucide-react';
import { userService } from '../services/user.service';
import { UserRelaWithDetails } from '../models/user.model';
import { FollowButton } from './follow-button';
import { notification } from 'antd';

interface FollowListProps {
  className?: string;
}

export function FollowList({ className = '' }: FollowListProps) {
  const [following, setFollowing] = useState<UserRelaWithDetails[]>([]);
  const [followers, setFollowers] = useState<UserRelaWithDetails[]>([]);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(true);
  const [activeTab, setActiveTab] = useState('following');

  // Load following list
  useEffect(() => {
    const loadFollowing = async () => {
      try {
        setIsLoadingFollowing(true);
        const followingList = await userService.getFollowing();
        setFollowing(followingList);
      } catch (error) {
        console.error('Error loading following list:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách đang theo dõi. Vui lòng thử lại.',
          placement: 'topRight',
        });
      } finally {
        setIsLoadingFollowing(false);
      }
    };

    loadFollowing();
  }, []);

  // Load followers list
  useEffect(() => {
    const loadFollowers = async () => {
      try {
        setIsLoadingFollowers(true);
        const followersList = await userService.getFollowers();
        setFollowers(followersList);
      } catch (error) {
        console.error('Error loading followers list:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách người theo dõi. Vui lòng thử lại.',
          placement: 'topRight',
        });
      } finally {
        setIsLoadingFollowers(false);
      }
    };

    loadFollowers();
  }, []);

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    if (!isFollowing) {
      // User unfollowed someone, remove from following list
      setFollowing(prev => prev.filter(user => user.user_id.toString() !== userId));
    }
  };

  const renderUserList = (users: UserRelaWithDetails[], isLoading: boolean, emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-muted-foreground">Đang tải...</span>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.user_id} className="flex items-center justify-between p-3 rounded-lg border border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-gray-950/50">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback>{user.full_name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.full_name || user.username}</div>
                <div className="text-sm text-muted-foreground">@{user.username}</div>
              </div>
            </div>
            <FollowButton
              userId={user.user_id.toString()}
              username={user.username}
              fullName={user.full_name}
              variant="outline"
              size="sm"
              onFollowChange={(isFollowing) => handleFollowChange(user.user_id.toString(), isFollowing)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={`${className} border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
          Mạng lưới theo dõi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="following" className="flex items-center">
              Đang theo dõi
              <Badge variant="secondary" className="ml-2">
                {following.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex items-center">
              Người theo dõi
              <Badge variant="secondary" className="ml-2">
                {followers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="following" className="mt-4">
            {renderUserList(
              following,
              isLoadingFollowing,
              'Bạn chưa theo dõi ai. Hãy tìm và theo dõi những người bạn quan tâm!'
            )}
          </TabsContent>
          
          <TabsContent value="followers" className="mt-4">
            {renderUserList(
              followers,
              isLoadingFollowers,
              'Chưa có ai theo dõi bạn. Hãy chia sẻ những trải nghiệm thú vị để thu hút người theo dõi!'
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
