'use client';

import { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useDirtyStateStore } from '@/features/manage/full-course/detail/stores/dirty-state.store';

interface EnhancedSaveButtonProps {
  id: string;
  isDirty: boolean;
  onSave: () => Promise<void>;
  onCancel?: () => void;
  text?: string;
  position?: 'bottom-right' | 'top-right' | 'bottom-full';
  discordStyle?: boolean;
  /**
   * Nếu true, sẽ hiển thị xác nhận khi người dùng cố gắng rời khỏi trang
   * @default true
   */
  preventNavigation?: boolean;
  /**
   * Thông báo hiển thị khi người dùng cố gắng rời khỏi trang
   * @default 'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang này?'
   */
  navigationWarningMessage?: string;
  /**
   * Trạng thái loading của nút Save
   * @default false
   */
  loading?: boolean;
  /**
   * Callback khi trạng thái loading thay đổi
   */
  onLoadingChange?: (loading: boolean) => void;
}

const EnhancedSaveButton = ({
  id,
  isDirty,
  onSave,
  onCancel,
  text = 'Lưu thay đổi',
  position = 'bottom-right',
  discordStyle = true,
  preventNavigation = true,
  navigationWarningMessage = 'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang này?',
  loading: externalLoading = false,
  onLoadingChange,
}: EnhancedSaveButtonProps) => {
  // Sử dụng state nội bộ nếu không có onLoadingChange
  const [internalLoading, setInternalLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Xác định trạng thái loading cuối cùng
  const loading = onLoadingChange ? externalLoading : internalLoading;

  // Get dirty state store functions
  const { setDirtyState, clearDirtyState } = useDirtyStateStore();

  // Update dirty state in store
  useEffect(() => {
    if (isDirty) {
      setDirtyState(isDirty, id);
      setVisible(true);
    } else {
      clearDirtyState();
      setVisible(false);
    }
  }, [id, isDirty, setDirtyState, clearDirtyState]);

  // Xử lý ngăn chặn chuyển hướng khi có thay đổi chưa được lưu
  useEffect(() => {
    // Hàm xử lý khi người dùng cố gắng rời khỏi trang
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && preventNavigation) {
        // Hiển thị thông báo mặc định của trình duyệt
        e.preventDefault();
        // Sử dụng cả hai cách để đảm bảo tương thích trên các trình duyệt
        const message = navigationWarningMessage;
        // @ts-ignore - returnValue is deprecated but still needed for browser compatibility
        e.returnValue = message;
        return message;
      }
    };

    // Thêm sự kiện beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Dọn dẹp khi component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, preventNavigation, navigationWarningMessage]);

  const handleSave = async () => {
    // Cập nhật trạng thái loading
    if (onLoadingChange) {
      onLoadingChange(true);
    } else {
      setInternalLoading(true);
    }

    try {
      await onSave();
      // Clear dirty state after successful save
      clearDirtyState();
    } finally {
      // Đặt lại trạng thái loading
      if (onLoadingChange) {
        onLoadingChange(false);
      } else {
        setInternalLoading(false);
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Clear dirty state after cancel
    clearDirtyState();
  };

  if (!visible) return null;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'top-right': 'top-6 right-6',
    'bottom-full': 'bottom-0 left-0 right-0',
  };

  if (discordStyle) {
    return (
      <div
        className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ease-in-out transform`}
      >
        <div className="bg-gray-800 text-white p-4 w-full flex justify-between items-center shadow-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">Bạn có thay đổi chưa được lưu</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleCancel}
              className="bg-gray-700 border-none text-white hover:bg-gray-600"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              className="bg-green-600 hover:bg-green-700 border-none"
              data-component-id={id}
            >
              {text}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ease-in-out transform`}
    >
      <Tooltip title={text}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={loading}
          className="shadow-lg"
          data-component-id={id}
        />
      </Tooltip>
    </div>
  );
};

export default EnhancedSaveButton;
