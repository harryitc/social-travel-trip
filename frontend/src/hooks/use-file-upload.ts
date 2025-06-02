'use client';

import { useState, useCallback } from 'react';
import { notification } from 'antd';

export interface UploadConfig {
  endpoint?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  headers?: Record<string, string>;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, config?: UploadConfig) => Promise<UploadResult>;
  uploadMultiple: (files: File[], config?: UploadConfig) => Promise<UploadResult[]>;
  reset: () => void;
}

const defaultConfig: UploadConfig = {
  endpoint: '/api/upload',
  maxSize: 10, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  headers: {}
};

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File, config: UploadConfig): boolean => {
    const { maxSize = 10, allowedTypes = [] } = config;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      notification.error({
        message: 'File too large',
        description: `File size must be less than ${maxSize}MB`,
        placement: 'topRight',
      });
      return false;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(`File type ${file.type} is not allowed`);
      notification.error({
        message: 'Invalid file type',
        description: `Allowed types: ${allowedTypes.join(', ')}`,
        placement: 'topRight',
      });
      return false;
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (
    file: File, 
    config: UploadConfig = {}
  ): Promise<UploadResult> => {
    const finalConfig = { ...defaultConfig, ...config };
    
    if (!validateFile(file, finalConfig)) {
      throw new Error(error || 'File validation failed');
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('type', file.type);

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(Math.round(percentComplete));
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              
              // Mock response for development
              const result: UploadResult = {
                url: response.url || URL.createObjectURL(file),
                filename: response.filename || file.name,
                size: file.size,
                type: file.type
              };

              notification.success({
                message: 'Upload successful',
                description: `${file.name} has been uploaded successfully`,
                placement: 'topRight',
              });

              resolve(result);
            } catch (parseError) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        // Handle abort
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'));
        });

        // Set headers
        Object.entries(finalConfig.headers || {}).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });

        // Start upload
        xhr.open('POST', finalConfig.endpoint || '/api/upload');
        xhr.send(formData);
      });

    } catch (uploadError) {
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Upload failed';
      setError(errorMessage);
      
      notification.error({
        message: 'Upload failed',
        description: errorMessage,
        placement: 'topRight',
      });
      
      throw uploadError;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [validateFile, error]);

  const uploadMultiple = useCallback(async (
    files: File[], 
    config: UploadConfig = {}
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], config);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }, [uploadFile]);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultiple,
    reset
  };
}

// Utility functions for common upload scenarios
export const uploadImage = async (file: File): Promise<UploadResult> => {
  const { uploadFile } = useFileUpload();
  return uploadFile(file, {
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 // 5MB for images
  });
};

export const uploadDocument = async (file: File): Promise<UploadResult> => {
  const { uploadFile } = useFileUpload();
  return uploadFile(file, {
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 20 // 20MB for documents
  });
};

export const uploadAvatar = async (file: File): Promise<UploadResult> => {
  const { uploadFile } = useFileUpload();
  return uploadFile(file, {
    allowedTypes: ['image/jpeg', 'image/png'],
    maxSize: 2 // 2MB for avatars
  });
};
