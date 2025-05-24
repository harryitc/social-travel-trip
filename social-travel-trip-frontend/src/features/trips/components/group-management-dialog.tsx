'use client';

import { useState, useEffect } from 'react';
import { TripGroup } from '../models/trip-group.model';
import { tripGroupService } from '../services/trip-group.service';
import { Button } from '@/components/ui/radix-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Label } from '@/components/ui/radix-ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Settings, Upload, Users, Loader2, MapPin, Image } from 'lucide-react';
import { notification } from 'antd';

interface GroupManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: TripGroup;
  onGroupUpdated: (updatedGroup: TripGroup) => void;
}

export function GroupManagementDialog({
  open,
  onOpenChange,
  group,
  onGroupUpdated
}: GroupManagementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Group info form state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Initialize form data when group changes
  useEffect(() => {
    if (group) {
      setGroupName(group.title || group.name);
      setGroupDescription(group.description || '');
      setGroupLocation(group.location || '');
      setGroupImage(group.image || '');
      setImagePreview(group.image || '');
    }
  }, [group]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateGroupInfo = async () => {
    try {
      setLoading(true);

      // TODO: Upload image if imageFile exists
      let coverUrl = groupImage;
      if (imageFile) {
        // In a real app, you would upload the image to a file service
        // For now, we'll use the preview URL
        coverUrl = imagePreview;
      }

      // Parse location from json_data if it exists
      let jsonData = group.json_data || {};
      if (groupLocation) {
        jsonData = {
          ...jsonData,
          location: groupLocation
        };
      }

      const updateData = {
        group_id: group.group_id,
        name: groupName.trim(),
        description: groupDescription.trim(),
        cover_url: coverUrl,
        json_data: jsonData
      };

      const updatedGroup = await tripGroupService.updateGroup(updateData);

      onGroupUpdated(updatedGroup);

      notification.success({
        message: 'Cập nhật thành công',
        description: 'Thông tin nhóm đã được cập nhật',
        placement: 'topRight',
        duration: 3,
      });

    } catch (error: any) {
      console.error('Error updating group:', error);
      notification.error({
        message: 'Lỗi cập nhật',
        description: error?.response?.data?.reasons?.message || 'Không thể cập nhật thông tin nhóm',
        placement: 'topRight',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Quản lý nhóm
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Thông tin nhóm
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Quản lý thành viên
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="groupName">Tên nhóm *</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Nhập tên nhóm..."
                  disabled={loading}
                />
              </div>

              {/* Group Description */}
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Mô tả</Label>
                <Textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Nhập mô tả nhóm..."
                  rows={3}
                  disabled={loading}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="groupLocation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Địa điểm
                </Label>
                <Input
                  id="groupLocation"
                  value={groupLocation}
                  onChange={(e) => setGroupLocation(e.target.value)}
                  placeholder="Nhập địa điểm..."
                  disabled={loading}
                />
              </div>

              {/* Group Image */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Ảnh nhóm
                </Label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="px-3"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateGroupInfo}
                  disabled={loading || !groupName.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Cập nhật
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Quản lý thành viên
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Chức năng quản lý thành viên sẽ được tích hợp vào danh sách thành viên
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveTab('info')}
              >
                Quay lại thông tin nhóm
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
