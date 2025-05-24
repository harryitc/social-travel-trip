'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';

import { Switch } from '@/components/ui/radix-ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/radix-ui/form';
import { MapPin, ImageIcon } from 'lucide-react';
import { CreateTripGroupData } from '../models/trip-group.model';
import { createGroupSchema, CreateGroupFormValues } from '../schemas/trip-group.schema';

type CreateGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (groupData: CreateTripGroupData) => void;
};

export function CreateGroupDialog({ open, onOpenChange, onCreateGroup }: CreateGroupDialogProps) {
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

  // Handle form submission
  const onSubmit = (data: CreateGroupFormValues) => {
    // Create group data using class
    const groupData = new CreateTripGroupData({
      title: data.title,
      description: data.description || '',
      location: data.location,
      isPrivate: data.isPrivate,
      image: data.image || '',
    });

    onCreateGroup(groupData);

    // Reset form
    form.reset();
    onOpenChange(false);
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
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="URL ảnh bìa (tùy chọn)"
                        className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-600 dark:text-red-400" />
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
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                Tạo nhóm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
