'use client';

import { useState } from 'react';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';

/**
 * Demo component để test avatar upload
 */
export function AvatarUploadDemo() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarChange = (url: string | null) => {
    setAvatarUrl(url);
    console.log('Avatar URL changed:', url);
  };

  const handleReset = () => {
    setAvatarUrl(null);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Avatar Upload Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Different sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Kích thước khác nhau</h3>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={handleAvatarChange}
                name="Small Avatar"
                size="sm"
              />
              <p className="text-xs mt-1">Small</p>
            </div>
            
            <div className="text-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={handleAvatarChange}
                name="Medium Avatar"
                size="md"
              />
              <p className="text-xs mt-1">Medium</p>
            </div>
            
            <div className="text-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={handleAvatarChange}
                name="Large Avatar"
                size="lg"
              />
              <p className="text-xs mt-1">Large</p>
            </div>
            
            <div className="text-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={handleAvatarChange}
                name="Extra Large Avatar"
                size="xl"
              />
              <p className="text-xs mt-1">XL</p>
            </div>
          </div>
        </div>

        {/* Current avatar URL */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Avatar URL hiện tại</h3>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
            <code className="text-sm break-all">
              {avatarUrl || 'Chưa có avatar'}
            </code>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset Avatar
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Hướng dẫn:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click vào icon camera để upload ảnh</li>
            <li>Chỉ chấp nhận file hình ảnh (jpg, png, gif...)</li>
            <li>Kích thước tối đa: 5MB</li>
            <li>Hover vào avatar có sẵn để thấy nút xóa</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
