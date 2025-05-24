'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Slider } from '@/components/ui/radix-ui/slider';
import { Upload, Crop, RotateCw, ZoomIn, ZoomOut, X, Check, Image as ImageIcon } from 'lucide-react';
import { notification } from 'antd';
import { API_ENDPOINT } from '@/config/api.config';

interface ImageUploadWithCropProps {
  value?: string;
  onChange: (file: File | null, preview: string | null) => void;
  onUpload?: (file: File) => Promise<string>; // Return uploaded URL
  accept?: string;
  maxSize?: number; // in MB
  aspectRatio?: number; // width/height ratio, undefined for free crop
  cropShape?: 'rect' | 'round';
  outputWidth?: number;
  outputHeight?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageUploadWithCrop({
  value,
  onChange,
  onUpload,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  aspectRatio,
  cropShape = 'rect',
  outputWidth = 400,
  outputHeight = 400,
  placeholder = 'Click to upload image',
  disabled = false,
  className = ''
}: ImageUploadWithCropProps) {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(value || null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notification.error({
        message: 'Invalid file type',
        description: 'Please select an image file',
        placement: 'topRight',
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      notification.error({
        message: 'File too large',
        description: `File size must be less than ${maxSize}MB`,
        placement: 'topRight',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      setShowCropDialog(true);
      
      // Reset crop settings
      setCropArea({ x: 0, y: 0, width: 100, height: 100 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [maxSize]);

  const getCroppedImage = useCallback(async (): Promise<{ file: File; preview: string } | null> => {
    if (!originalImage || !canvasRef.current || !imageRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const image = imageRef.current;
    
    // Set canvas size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Calculate crop dimensions
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropX = cropArea.x * scaleX;
    const cropY = cropArea.y * scaleY;
    const cropWidth = cropArea.width * scaleX;
    const cropHeight = cropArea.height * scaleY;

    // Apply transformations
    ctx.save();
    
    // Move to center for rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    
    // Draw cropped image
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      -outputWidth / 2,
      -outputHeight / 2,
      outputWidth,
      outputHeight
    );
    
    ctx.restore();

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        const preview = canvas.toDataURL('image/jpeg', 0.9);
        resolve({ file, preview });
      }, 'image/jpeg', 0.9);
    });
  }, [originalImage, cropArea, zoom, rotation, outputWidth, outputHeight]);

  const handleCropConfirm = async () => {
    try {
      const result = await getCroppedImage();
      if (!result) return;

      const { file, preview } = result;
      
      setCroppedPreview(preview);
      setShowCropDialog(false);

      // Upload if onUpload is provided
      if (onUpload) {
        setUploading(true);
        try {
          const uploadedUrl = await onUpload(file);
          onChange(file, uploadedUrl);
          notification.success({
            message: 'Upload successful',
            description: 'Image has been uploaded successfully',
            placement: 'topRight',
          });
        } catch (error) {
          console.error('Upload error:', error);
          notification.error({
            message: 'Upload failed',
            description: 'Failed to upload image. Please try again.',
            placement: 'topRight',
          });
        } finally {
          setUploading(false);
        }
      } else {
        onChange(file, preview);
      }
    } catch (error) {
      console.error('Crop error:', error);
      notification.error({
        message: 'Crop failed',
        description: 'Failed to process image. Please try again.',
        placement: 'topRight',
      });
    }
  };

  const handleRemove = () => {
    setCroppedPreview(null);
    onChange(null, null);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCropX = cropArea.x;
    const startCropY = cropArea.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(startCropX + deltaX, 100 - prev.width)),
        y: Math.max(0, Math.min(startCropY + deltaY, 100 - prev.height))
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        {croppedPreview ? (
          <div className="relative group">
            <div className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${cropShape === 'round' ? 'rounded-full' : ''}`}>
              <img
                src={API_ENDPOINT.file_image_v2 + croppedPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={disabled || uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${cropShape === 'round' ? 'rounded-full' : ''}`}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 text-center px-2">{placeholder}</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Image
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
              {originalImage && (
                <>
                  <img
                    ref={imageRef}
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center'
                    }}
                  />
                  {/* Crop overlay */}
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
                    style={{
                      left: `${cropArea.x}%`,
                      top: `${cropArea.y}%`,
                      width: `${cropArea.width}%`,
                      height: `${cropArea.height}%`,
                      borderRadius: cropShape === 'round' ? '50%' : '0'
                    }}
                    onMouseDown={handleDragStart}
                  />
                </>
              )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  Zoom: {zoom.toFixed(1)}x
                </Label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Rotation: {rotation}°
                </Label>
                <Slider
                  value={[rotation]}
                  onValueChange={(value) => setRotation(value[0])}
                  min={-180}
                  max={180}
                  step={15}
                  className="w-full"
                />
              </div>
            </div>

            {/* Canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCropDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCropConfirm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
