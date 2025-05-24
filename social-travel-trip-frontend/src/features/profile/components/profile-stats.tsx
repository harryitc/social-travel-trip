'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Progress } from '@/components/ui/radix-ui/progress';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  Award
} from 'lucide-react';
import { UserProfile } from '../models/profile.model';

interface ProfileStatsProps {
  user: UserProfile;
  stats?: {
    postsCount?: number;
    followersCount?: number;
    followingCount?: number;
    tripsCount?: number;
    likesReceived?: number;
    joinedDays?: number;
  };
}

export function ProfileStats({ user, stats = {} }: ProfileStatsProps) {
  const {
    postsCount = 0,
    followersCount = 0,
    followingCount = 0,
    tripsCount = 0,
    likesReceived = 0,
    joinedDays = 0
  } = stats;

  const getActivityLevel = () => {
    const totalActivity = postsCount + tripsCount + likesReceived;
    if (totalActivity >= 100) return { level: 'Rất tích cực', color: 'bg-green-500', percentage: 100 };
    if (totalActivity >= 50) return { level: 'Tích cực', color: 'bg-blue-500', percentage: 75 };
    if (totalActivity >= 20) return { level: 'Hoạt động', color: 'bg-yellow-500', percentage: 50 };
    if (totalActivity >= 5) return { level: 'Mới bắt đầu', color: 'bg-orange-500', percentage: 25 };
    return { level: 'Mới tham gia', color: 'bg-gray-500', percentage: 10 };
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Activity Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Mức độ hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cấp độ hiện tại</span>
              <Badge variant="secondary" className={`${activityLevel.color} text-white`}>
                {activityLevel.level}
              </Badge>
            </div>
            <Progress value={activityLevel.percentage} className="h-2" />
            <p className="text-xs text-gray-500">
              Dựa trên số bài viết, chuyến đi và tương tác của bạn
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Posts */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{postsCount}</p>
                <p className="text-xs text-gray-500">Bài viết</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Followers */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{followersCount}</p>
                <p className="text-xs text-gray-500">Người theo dõi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Following */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{followingCount}</p>
                <p className="text-xs text-gray-500">Đang theo dõi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trips */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tripsCount}</p>
                <p className="text-xs text-gray-500">Chuyến đi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Likes */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Star className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{likesReceived}</p>
                <p className="text-xs text-gray-500">Lượt thích</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Days Joined */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{joinedDays}</p>
                <p className="text-xs text-gray-500">Ngày tham gia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Thành tích
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.isProfileComplete && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Hồ sơ hoàn thiện
              </Badge>
            )}
            {postsCount >= 10 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Người viết tích cực
              </Badge>
            )}
            {tripsCount >= 5 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Du lịch gia
              </Badge>
            )}
            {followersCount >= 50 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Người có ảnh hưởng
              </Badge>
            )}
            {joinedDays >= 365 && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Thành viên lâu năm
              </Badge>
            )}
            {(postsCount === 0 && tripsCount === 0 && followersCount === 0) && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                Thành viên mới
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
