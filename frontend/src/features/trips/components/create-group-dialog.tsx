'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';

import { Switch } from '@/components/ui/radix-ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/radix-ui/form';
import { MapPin } from 'lucide-react';
import { CreateTripGroupData } from '../models/trip-group.model';
import { createGroupSchema, CreateGroupFormValues } from '../schemas/trip-group.schema';
import { SimpleImageUpload } from '@/components/ui/simple-image-upload';
import { fileService } from '@/features/file/file.service';

type CreateGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (groupData: CreateTripGroupData) => void;
};

export function CreateGroupDialog({ open, onOpenChange, onCreateGroup }: CreateGroupDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with Zod validation
  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      isPrivate: true,
      image: '',
    },
  });

  // Upload image function
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await fileService.uploadFile(file);
      // Return the file URL from the response
      return response.files[0]?.file_url || '';
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Handle form submission
  const onSubmit = async (data: CreateGroupFormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = '';

      // If image is a File object, upload it first
      if (data.image instanceof File) {
        imageUrl = await uploadImage(data.image);
      } else if (typeof data.image === 'string') {
        imageUrl = data.image;
      }

      // Create group data using class
      const groupData = new CreateTripGroupData({
        title: data.title,
        description: data.description || '',
        location: data.location,
        isPrivate: data.isPrivate,
        image: imageUrl,
      });

      onCreateGroup(groupData);

      // Reset form
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating group:', error);
      // Form will show validation errors automatically
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Tạo nhóm chuyến đi mới
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tạo một nhóm mới để cùng bạn bè lên kế hoạch cho chuyến đi tuyệt vời
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Group Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên nhóm *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Khám phá Đà Lạt"
                      className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về chuyến đi của bạn..."
                      rows={3}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 resize-none"
                      maxLength={255}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 dark:text-red-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(field.value || '').length}/255 ký tự
                  </p>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Địa điểm *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
                        className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ảnh bìa nhóm
                  </FormLabel>
                  <FormControl>
                    <SimpleImageUpload
                      value={typeof field.value === 'string' ? field.value : ''}
                      onFileChange={(file) => {
                        // Store the File object for upload later
                        field.onChange(file);
                      }}
                      placeholder="Chọn ảnh bìa cho nhóm (tùy chọn)"
                      maxSize={5} // 5MB
                      className="w-full"
                      previewSize="md"
                      autoUpload={false}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 dark:text-red-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hỗ trợ JPG, PNG, GIF, WebP. Tối đa 5MB.
                  </p>
                </FormItem>
              )}
            />

            {/* Privacy Setting */}
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Nhóm riêng tư</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value
                        ? 'Chỉ những người được mời mới có thể tham gia'
                        : 'Mọi người đều có thể tham gia nhóm'}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="px-6 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? 'Đang tạo nhóm...' : 'Tạo nhóm'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
