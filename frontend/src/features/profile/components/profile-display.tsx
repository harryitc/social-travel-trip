'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Progress } from '@/components/ui/radix-ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../models/profile.model';
import { API_ENDPOINT } from '@/config/api.config';

interface ProfileDisplayProps {
  user: UserProfile;
  onEdit?: () => void;
  onChangePassword?: () => void;
  showActions?: boolean;
}

export function ProfileDisplay({ 
  user, 
  onEdit, 
  onChangePassword, 
  showActions = true 
}: ProfileDisplayProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Chưa cập nhật';
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user.avatar_url ? `${API_ENDPOINT.file_image_v2}${user.avatar_url}` : undefined} 
                  alt={user.displayName} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Profile completion badge */}
              <div className="absolute -bottom-2 -right-2">
                <Badge 
                  variant={user.isProfileComplete ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.completionPercentage}%
                </Badge>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.displayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                @{user.username}
              </p>
              
              {/* Profile completion */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {user.isProfileComplete ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span>
                    {user.isProfileComplete 
                      ? 'Hồ sơ đã hoàn thiện' 
                      : 'Hồ sơ chưa hoàn thiện'
                    }
                  </span>
                </div>
                <Progress value={user.completionPercentage} className="w-full sm:w-64" />
              </div>

              {/* Action Buttons */}
              {showActions && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={onEdit} className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onChangePassword}
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Đổi mật khẩu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                <p className="text-gray-900 dark:text-white">
                  {user.full_name || 'Chưa cập nhật'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900 dark:text-white">
                  {user.email || 'Chưa cập nhật'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                <p className="text-gray-900 dark:text-white">
                  {user.phone_number || 'Chưa cập nhật'}
                </p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(user.date_of_birth)}
                </p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Giới tính</p>
                <p className="text-gray-900 dark:text-white">
                  {user.genderText}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                <p className="text-gray-900 dark:text-white">
                  {user.address || 'Chưa cập nhật'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Ngày tạo tài khoản</p>
              <p className="text-gray-900 dark:text-white">
                {formatDate(user.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
              <p className="text-gray-900 dark:text-white">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
