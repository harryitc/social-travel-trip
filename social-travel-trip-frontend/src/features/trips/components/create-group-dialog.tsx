'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Label } from '@/components/ui/radix-ui/label';
import { Switch } from '@/components/ui/radix-ui/switch';
import { Calendar } from '@/components/ui/radix-ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/radix-ui/popover';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
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
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    maxMembers: 10,
    isPrivate: false,
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
      startDate: formData.startDate,
      endDate: formData.endDate,
      maxMembers: formData.maxMembers,
      isPrivate: formData.isPrivate,
      image: formData.image,
    });

    onCreateGroup(groupData);

    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: undefined,
      endDate: undefined,
      maxMembers: 10,
      isPrivate: false,
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Ngày kết thúc</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Số thành viên tối đa</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="50"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 10 })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nhóm riêng tư</Label>
              <p className="text-sm text-muted-foreground">
                Chỉ những người được mời mới có thể tham gia
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
