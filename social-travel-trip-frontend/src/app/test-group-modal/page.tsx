'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { CreateGroupDialog } from '@/features/trips/components/create-group-dialog';
import { CreateTripGroupData } from '@/features/trips/models/trip-group.model';
import { tripGroupService } from '@/features/trips/services/trip-group.service';
import { notification } from 'antd';

export default function TestGroupModalPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateGroup = async (groupData: CreateTripGroupData) => {
    try {
      console.log('Creating group with data:', groupData.toBackendDTO());
      const result = await tripGroupService.createGroup(groupData);
      console.log('Group created successfully:', result);
      setShowCreateDialog(false);

      notification.success({
        message: 'Tạo nhóm thành công',
        description: `Nhóm "${result.title}" đã được tạo thành công!`,
        placement: 'topRight',
        duration: 3,
      });
    } catch (error: any) {
      console.error('Error creating group:', error);
      console.error('Error details:', error.response?.data || error.message);

      notification.error({
        message: 'Lỗi tạo nhóm',
        description: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo nhóm',
        placement: 'topRight',
        duration: 5,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Test Group Creation Modal
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Modal Tạo Nhóm</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click vào nút bên dưới để mở modal tạo nhóm và test chức năng.
          </p>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Mở Modal Tạo Nhóm
          </Button>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin test:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Tên nhóm: bắt buộc</li>
            <li>Mô tả: tùy chọn</li>
            <li>Địa điểm đi: bắt buộc (sẽ lưu vào json_data)</li>
            <li>Ảnh bìa nhóm: tùy chọn (URL)</li>
            <li>Status: mặc định là riêng tư (private)</li>
          </ul>
        </div>
      </div>

      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}
