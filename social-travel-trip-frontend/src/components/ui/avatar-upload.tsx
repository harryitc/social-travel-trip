'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { fileService } from '@/features/file/file.service';
import { API_ENDPOINT } from '@/config/api.config';
import { notification } from 'antd';

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  showUploadButton?: boolean;
}

export function AvatarUpload({
  value,
  onChange,
  name = 'User',
  size = 'lg',
  disabled = false,
  showUploadButton = true
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const buttonSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn file hình ảnh'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification.error({
        message: 'Lỗi',
        description: 'Kích thước file không được vượt quá 5MB'
      });
      return;
    }

    try {
      setUploading(true);

      // Upload file using fileService
      const result = await fileService.uploadFile(file);

      if (result && result.files && result.files.length > 0) {
        const uploadedFile = result.files[0];
        onChange(uploadedFile.file_url || uploadedFile.server_file_name);

        notification.success({
          message: 'Thành công',
          description: 'Tải ảnh đại diện thành công!'
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tải ảnh lên'
      });
    } finally {
      setUploading(false);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={API_ENDPOINT.file_image_v2 + (value || undefined)} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Upload Button */}
      {showUploadButton && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className={`absolute -bottom-1 -right-1 ${buttonSizes[size]} p-0 rounded-full border-2 border-white dark:border-gray-800 shadow-sm`}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Camera className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* Remove Button (when avatar exists) */}
      {value && showUploadButton && (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full border-2 border-white dark:border-gray-800 shadow-sm opacity-0 hover:opacity-100 transition-opacity"
          onClick={handleRemove}
          disabled={disabled || uploading}
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
