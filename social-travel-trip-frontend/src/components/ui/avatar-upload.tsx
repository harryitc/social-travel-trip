'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { ImageUploadWithCrop } from './image-upload-with-crop';
import { useFileUpload } from '@/hooks/use-file-upload';
import { API_ENDPOINT } from '@/config/api.config';

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  showUploadButton?: boolean;
  uploadEndpoint?: string;
}

export function AvatarUpload({
  value,
  onChange,
  name = 'User',
  size = 'lg',
  disabled = false,
  showUploadButton = true,
  uploadEndpoint = '/api/upload/avatar'
}: AvatarUploadProps) {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadFile } = useFileUpload();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    setTempFile(file);
    setShowCropDialog(true);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (file: File | null, preview: string | null) => {
    if (!file || !preview) return;

    try {
      // Upload the cropped file
      const result = await uploadFile(file, {
        endpoint: uploadEndpoint,
        maxSize: 2, // 2MB for avatars
        allowedTypes: ['image/jpeg', 'image/png']
      });

      onChange(result.url);
      setShowCropDialog(false);
      setTempFile(null);
      setTempPreview(null);
    } catch (error) {
      console.error('Avatar upload error:', error);
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

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Avatar
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Crop your image to create the perfect avatar. The image will be resized to 200x200 pixels.
            </p>

            {tempFile && (
              <ImageUploadWithCrop
                value={tempPreview}
                onChange={handleCropComplete}
                aspectRatio={1} // Square aspect ratio
                cropShape="round"
                outputWidth={200}
                outputHeight={200}
                placeholder="Select avatar image"
                className="flex justify-center"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Preset avatar upload for different use cases
export function UserAvatarUpload(props: Omit<AvatarUploadProps, 'uploadEndpoint'>) {
  return (
    <AvatarUpload
      {...props}
      uploadEndpoint="/api/upload/user-avatar"
    />
  );
}

export function GroupAvatarUpload(props: Omit<AvatarUploadProps, 'uploadEndpoint' | 'size'>) {
  return (
    <AvatarUpload
      {...props}
      size="xl"
      uploadEndpoint="/api/upload/group-avatar"
    />
  );
}
