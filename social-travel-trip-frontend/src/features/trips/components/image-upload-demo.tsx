'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { ImageIcon, X, FileIcon } from 'lucide-react';
import { fileService } from '@/features/file/file.service';
import { notification } from 'antd';

/**
 * Demo component để test tính năng upload hình ảnh
 * Có thể sử dụng để test file service trước khi tích hợp vào chat
 */
export function ImageUploadDemo() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }>>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));

      setSelectedImages([...selectedImages, ...filesArray]);
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    const newImagePreviewUrls = [...imagePreviewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreviewUrls[index]);

    newSelectedImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng chọn ít nhất một hình ảnh để upload.',
        placement: 'topRight',
      });
      return;
    }

    setUploading(true);

    try {
      notification.info({
        message: 'Đang tải lên...',
        description: `Đang tải lên ${selectedImages.length} hình ảnh`,
        placement: 'topRight',
        duration: 2,
      });

      const uploadResults = await fileService.uploadMultipleFiles(selectedImages);
      
      const newUploadedFiles: Array<{
        type: 'image' | 'file';
        url: string;
        name: string;
        size?: number;
      }> = [];

      for (let i = 0; i < uploadResults.length; i++) {
        const result = uploadResults[i];
        const originalFile = selectedImages[i];
        
        if (result.files && result.files.length > 0) {
          newUploadedFiles.push({
            type: 'image',
            url: result.files[0].file_url,
            name: result.files[0].file_name || originalFile.name,
            size: originalFile.size,
          });
        }
      }

      setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);

      // Clear selected images
      setSelectedImages([]);
      setImagePreviewUrls([]);

      notification.success({
        message: 'Thành công',
        description: `Đã tải lên ${newUploadedFiles.length} hình ảnh`,
        placement: 'topRight',
      });

    } catch (error) {
      console.error('Error uploading files:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải lên hình ảnh. Vui lòng thử lại.',
        placement: 'topRight',
      });
    } finally {
      setUploading(false);
    }
  };

  const clearAll = () => {
    // Revoke all object URLs
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setUploadedFiles([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Demo Upload Hình ảnh
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test tính năng upload hình ảnh sử dụng file service
        </p>
      </div>

      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Click để chọn hình ảnh
          </span>
        </label>
      </div>

      {/* Preview Area */}
      {imagePreviewUrls.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Hình ảnh đã chọn ({imagePreviewUrls.length})
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleUpload}
          disabled={selectedImages.length === 0 || uploading}
          className="flex-1"
        >
          {uploading ? 'Đang tải lên...' : `Upload ${selectedImages.length} hình ảnh`}
        </Button>
        <Button
          variant="outline"
          onClick={clearAll}
          disabled={selectedImages.length === 0 && uploadedFiles.length === 0}
        >
          Xóa tất cả
        </Button>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Hình ảnh đã upload ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                {file.type === 'image' ? (
                  <div className="space-y-2">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded cursor-pointer"
                      onClick={() => window.open(file.url, '_blank')}
                    />
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <div className="truncate">{file.name}</div>
                      <div>{file.size ? `${Math.round(file.size / 1024)} KB` : ''}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-8 w-8 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">
                        {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
