'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Progress } from '@/components/ui/radix-ui/progress';
import { Upload, X, Loader2 } from 'lucide-react';
import { fileService, FileUploadResponse } from '@/features/file/file.service';
import { notification } from 'antd';
import { API_ENDPOINT } from '@/config/api.config';

interface SimpleImageUploadProps {
  value?: string;
  onChange?: (url: string | null) => void;
  onFileChange: (file: File | null) => void; // Main callback that emits File object
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  showProgress?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  previewSize?: 'sm' | 'md' | 'lg';
  autoUpload?: boolean; // Whether to auto upload or just emit file
}

export function SimpleImageUpload({
  value,
  onChange,
  onFileChange,
  placeholder = 'Click to upload image',
  disabled = false,
  className = '',
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showProgress = true,
  multiple = false,
  maxFiles = 5,
  previewSize = 'md',
  autoUpload = false
}: SimpleImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value ? [value] : []);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      notification.error({
        message: 'Invalid file type',
        description: `Allowed types: ${allowedTypes.join(', ')}`,
        placement: 'topRight',
      });
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      notification.error({
        message: 'File too large',
        description: `File size must be less than ${maxSize}MB`,
        placement: 'topRight',
      });
      return false;
    }

    return true;
  }, [allowedTypes, maxSize]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file count
    if (multiple && previews.length + fileArray.length > maxFiles) {
      notification.warning({
        message: 'Too many files',
        description: `Maximum ${maxFiles} files allowed`,
        placement: 'topRight',
      });
      return;
    }

    if (!multiple && fileArray.length > 1) {
      notification.warning({
        message: 'Single file only',
        description: 'Please select only one file',
        placement: 'topRight',
      });
      return;
    }

    // Validate each file
    for (const file of fileArray) {
      if (!validateFile(file)) {
        return;
      }
    }

    // Create local previews first
    const newPreviews: string[] = [];
    fileArray.forEach(file => {
      const preview = URL.createObjectURL(file);
      newPreviews.push(preview);
    });

    try {
      if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
      } else {
        setPreviews(newPreviews);
      }

      // Emit file(s) immediately
      if (multiple) {
        // For multiple files, emit each file
        fileArray.forEach(file => onFileChange(file));
      } else {
        onFileChange(fileArray[0]);
      }

      // Auto upload if enabled
      if (autoUpload) {
        setUploading(true);
        setProgress(0);

        if (multiple) {
          const results = await fileService.uploadMultipleFiles(fileArray);
          const urls = results.map(result => result.files[0].file_url);

          // Update with uploaded URLs
          setPreviews(prev => {
            const updated = [...prev];
            urls.forEach((url, index) => {
              const previewIndex = prev.length - newPreviews.length + index;
              if (previewIndex >= 0) {
                // Clean up object URL
                if (updated[previewIndex].startsWith('blob:')) {
                  URL.revokeObjectURL(updated[previewIndex]);
                }
                updated[previewIndex] = url;
              }
            });
            return updated;
          });

          onChange?.(urls[urls.length - 1]); // Return last uploaded URL
        } else {
          const result = await fileService.uploadFile(fileArray[0]);
          const url = result.files[0].file_url;

          // Clean up object URL
          newPreviews.forEach(preview => {
            if (preview.startsWith('blob:')) {
              URL.revokeObjectURL(preview);
            }
          });

          setPreviews([url]);
          onChange?.(url);
        }

        setUploading(false);
        setProgress(100);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      setProgress(0);

      // Clean up failed previews
      newPreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });

      if (multiple) {
        setPreviews(prev => prev.slice(0, prev.length - newPreviews.length));
      } else {
        setPreviews([]);
      }

      notification.error({
        message: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        placement: 'topRight',
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [multiple, maxFiles, previews.length, validateFile, onFileChange, autoUpload, onChange]);

  const handleRemove = useCallback((index: number) => {
    setPreviews(prev => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];

      // Clean up object URL
      if (removed && removed.startsWith('blob:')) {
        URL.revokeObjectURL(removed);
      }

      return updated;
    });

    if (!multiple) {
      onChange?.(null);
      onFileChange(null);
    }
  }, [multiple, onChange, onFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">Uploading...</p>
            {showProgress && (
              <div className="max-w-xs mx-auto">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{progress}%</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-400">
              {multiple ? `Drop files here or click to browse (max ${maxFiles})` : 'Drop file here or click to browse'}
            </p>
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className={`${sizeClasses[previewSize]} border border-gray-200 rounded-lg overflow-hidden`}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Remove Button */}
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={disabled || uploading}
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Loading Overlay */}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File Info */}
      {multiple && previews.length > 0 && (
        <p className="text-xs text-gray-500">
          {previews.length} of {maxFiles} files selected
        </p>
      )}
    </div>
  );
}
