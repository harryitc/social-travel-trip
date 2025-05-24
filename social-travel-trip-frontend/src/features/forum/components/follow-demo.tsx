'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { FollowButton } from './follow-button';

// Mock data for demo
const mockUsers = [
  {
    id: '1',
    username: 'travel_lover',
    fullName: 'Nguyễn Văn A',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Yêu thích khám phá những vùng đất mới',
    posts: 45,
    followers: 120,
    following: 89
  },
  {
    id: '2',
    username: 'mountain_explorer',
    fullName: 'Trần Thị B',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Chuyên gia leo núi và trekking',
    posts: 78,
    followers: 340,
    following: 156
  },
  {
    id: '3',
    username: 'beach_wanderer',
    fullName: 'Lê Văn C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Đam mê biển cả và các hoạt động dưới nước',
    posts: 32,
    followers: 89,
    following: 67
  },
  {
    id: '4',
    username: 'culture_seeker',
    fullName: 'Phạm Thị D',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Khám phá văn hóa và ẩm thực địa phương',
    posts: 56,
    followers: 203,
    following: 134
  }
];

export function FollowDemo() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
          Demo Chức năng Theo dõi
        </h1>
        <p className="text-muted-foreground">
          Test các component follow với dữ liệu mẫu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockUsers.map((user) => (
          <Card key={user.id} className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <FollowButton
                  userId={user.id}
                  username={user.username}
                  fullName={user.fullName}
                  variant="outline"
                  size="sm"
                  onFollowChange={(isFollowing) => 
                    console.log(`${user.fullName} follow status:`, isFollowing)
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{user.bio}</p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{user.posts}</div>
                  <div className="text-xs text-muted-foreground">Bài viết</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{user.followers}</div>
                  <div className="text-xs text-muted-foreground">Người theo dõi</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{user.following}</div>
                  <div className="text-xs text-muted-foreground">Đang theo dõi</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Hướng dẫn Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Hoàn thành
            </Badge>
            <span className="text-sm">FollowButton component với loading states</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Hoàn thành
            </Badge>
            <span className="text-sm">API integration cho follow/unfollow</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Hoàn thành
            </Badge>
            <span className="text-sm">Notifications với Antd</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Hoàn thành
            </Badge>
            <span className="text-sm">FollowList component với tabs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✅ Hoàn thành
            </Badge>
            <span className="text-sm">FollowPage với search và statistics</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🔄 Tích hợp
            </Badge>
            <span className="text-sm">Tích hợp vào PostItem component</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
