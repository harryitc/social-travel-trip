import { ApiErrorModel } from '@/models/error.model';
import { ERROR_KEY } from '@/error.config';
import { notification as Notification } from 'antd';
import { isWindow } from './utils/windows.util';
import { isDevMode } from './utils/development-mode.utils';

// Biến lưu trữ callback xử lý lỗi tùy chỉnh
let customErrorHandler: ((error: ApiErrorModel) => void) | null = null;

/**
 * Đặt callback xử lý lỗi tùy chỉnh
 * @param handler Hàm xử lý lỗi
 */
export const setCustomErrorHandler = (handler: (error: ApiErrorModel) => void) => {
  customErrorHandler = handler;
};

/**
 * Xử lý lỗi API
 * @param error Đối tượng lỗi API
 */
export const handleApiError = (error: ApiErrorModel): void => {
  const [notification] = Notification.useNotification();

  // Gọi handler tùy chỉnh nếu có
  if (customErrorHandler) {
    customErrorHandler(error);
    return;
  }

  // Xử lý lỗi xác thực
  if (error.isAuthError()) {
    if (isWindow()) {
      // Chuyển hướng đến trang đăng nhập
      window.location.href = '/auth/login';
    }
    return;
  }

  // Hiển thị thông báo lỗi
  if (isWindow()) {
    notification.error({
      message: 'Lỗi ' + error.httpStatus,
      description: error.getErrorMessage(),
      placement: 'topRight',
      duration: 5,
    });
  }

  // Log lỗi ra console trong môi trường development
  if (isDevMode()) {
    console.error('[API Error]', error.toJSON());
  }
};

/**
 * Hook để xử lý lỗi API trong component React
 * @param error Đối tượng lỗi API
 * @param options Tùy chọn xử lý lỗi
 */
export const useApiErrorHandler = (
  error: ApiErrorModel | null,
  options?: {
    onAuthError?: () => void;
    onSystemError?: () => void;
    onOtherError?: (error: ApiErrorModel) => void;
  },
) => {
  const [notification] = Notification.useNotification();
  if (!error) return;

  // Xử lý lỗi xác thực
  if (error.isAuthError()) {
    if (options?.onAuthError) {
      options.onAuthError();
    } else {
      // Xử lý mặc định
      if (isWindow()) {
        window.location.href = '/auth/login';
      }
    }
    return;
  }

  // Xử lý lỗi hệ thống
  if (error.hasSystemError()) {
    if (options?.onSystemError) {
      options.onSystemError();
    } else {
      // Xử lý mặc định
      if (isWindow()) {
        notification.error({
          message: 'Lỗi hệ thống ' + error.httpStatus,
          description: error.getErrorMessage(),
          placement: 'topRight',
          duration: 5,
        });
      }
    }
    return;
  }

  // Xử lý các loại lỗi khác
  if (options?.onOtherError) {
    options.onOtherError(error);
  } else {
    // Xử lý mặc định
    if (isWindow()) {
      notification.error({
        message: 'Lỗi ' + error.httpStatus,
        description: error.getErrorMessage(),
        placement: 'topRight',
        duration: 5,
      });
    }
  }
};
