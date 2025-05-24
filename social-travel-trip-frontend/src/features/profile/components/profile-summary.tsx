'use client';

import { Card, CardContent } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { UserProfile } from '../models/profile.model';
import { API_ENDPOINT } from '@/config/api.config';

interface ProfileSummaryProps {
  user: UserProfile;
  compact?: boolean;
}

/**
 * Component hiển thị tóm tắt thông tin profile
 * Dùng cho sidebar hoặc các nơi cần hiển thị thông tin ngắn gọn
 */
export function ProfileSummary({ user, compact = false }: ProfileSummaryProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user.avatar_url ? `${API_ENDPOINT.file_image_v2}${user.avatar_url}` : undefined} 
            alt={user.displayName} 
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{user.username}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={user.avatar_url ? `${API_ENDPOINT.file_image_v2}${user.avatar_url}` : undefined} 
              alt={user.displayName} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.displayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              @{user.username}
            </p>
            
            {user.email && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                {user.email}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={user.isProfileComplete ? "default" : "secondary"}
                className="text-xs"
              >
                {user.completionPercentage}% hoàn thiện
              </Badge>
              
              {user.isProfileComplete && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Đã xác minh
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
