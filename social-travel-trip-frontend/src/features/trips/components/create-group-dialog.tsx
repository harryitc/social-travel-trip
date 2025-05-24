'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Label } from '@/components/ui/radix-ui/label';
import { Switch } from '@/components/ui/radix-ui/switch';
import { MapPin, ImageIcon } from 'lucide-react';
import { CreateTripGroupData } from '../models/trip-group.model';

type CreateGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (groupData: CreateTripGroupData) => void;
};

export function CreateGroupDialog({ open, onOpenChange, onCreateGroup }: CreateGroupDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    isPrivate: true, // Mặc định là riêng tư
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.location.trim()) {
      return;
    }

    // Create group data using class
    const groupData = new CreateTripGroupData({
      title: formData.title,
      description: formData.description,
      location: formData.location,
      isPrivate: formData.isPrivate,
      image: formData.image,
    });

    onCreateGroup(groupData);

    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      isPrivate: true,
      image: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Tạo nhóm chuyến đi mới
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tạo một nhóm mới để cùng bạn bè lên kế hoạch cho chuyến đi tuyệt vời
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên nhóm *
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: Khám phá Đà Lạt"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả về chuyến đi của bạn..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Địa điểm *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                required
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ảnh bìa nhóm
            </Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="image"
                placeholder="URL ảnh bìa (tùy chọn)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nhóm riêng tư</Label>
              <p className="text-sm text-muted-foreground">
                {formData.isPrivate
                  ? 'Chỉ những người được mời mới có thể tham gia'
                  : 'Mọi người đều có thể tham gia nhóm'}
              </p>
            </div>
            <Switch
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              disabled={!formData.title.trim() || !formData.location.trim()}
            >
              Tạo nhóm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
