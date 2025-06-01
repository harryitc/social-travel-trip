'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Progress } from '@/components/ui/radix-ui/progress';
import { 
  Eye, 
  FileText, 
  Users, 
  UserPlus, 
  MapPin,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { UserProfileWithStats } from '../services/profile.service';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface ProfileStatsCardProps {
  profileData: UserProfileWithStats;
  className?: string;
}

export function ProfileStatsCard({ profileData, className = '' }: ProfileStatsCardProps) {
  const { stats, formattedStats } = profileData;

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50';
    if (percentage >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getCompletionStatus = (percentage: number) => {
    if (percentage >= 90) return 'Hoàn thiện';
    if (percentage >= 70) return 'Gần hoàn thiện';
    if (percentage >= 50) return 'Trung bình';
    return 'Cần cập nhật';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Profile Completion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Độ hoàn thiện hồ sơ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tiến độ</span>
            <Badge className={getCompletionColor(stats.completion_percentage)}>
              {getCompletionStatus(stats.completion_percentage)}
            </Badge>
          </div>
          <Progress value={stats.completion_percentage} className="h-2" />
          <div className="text-right">
            <span className="text-2xl font-bold text-purple-600">{stats.completion_percentage}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.profile_views)}
              </div>
              <div className="text-xs text-gray-600">Lượt xem</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.posts_count)}
              </div>
              <div className="text-xs text-gray-600">Bài viết</div>
            </div>
          </div>
          {stats.last_active && (
            <div className="text-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 inline mr-1" />
              Hoạt động {dayjs(stats.last_active).fromNow()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Kết nối xã hội
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <UserPlus className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.followers_count)}
              </div>
              <div className="text-xs text-gray-600">Người theo dõi</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-indigo-600">
                {formatNumber(stats.following_count)}
              </div>
              <div className="text-xs text-gray-600">Đang theo dõi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Du lịch & Nhóm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(stats.trips_count)}
              </div>
              <div className="text-xs text-gray-600">Chuyến đi</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded-lg">
              <Users className="h-6 w-6 text-teal-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-teal-600">
                {formatNumber(stats.groups_count)}
              </div>
              <div className="text-xs text-gray-600">Nhóm tham gia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Views */}
      {profileData.recent_views && profileData.recent_views.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-600" />
              Lượt xem gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profileData.recent_views.slice(0, 3).map((view: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {view.full_name ? view.full_name.charAt(0) : view.username.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{view.full_name || view.username}</div>
                    <div className="text-xs text-gray-500">
                      {dayjs(view.viewed_at).fromNow()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
