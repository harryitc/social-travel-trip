import { ApiErrorModel } from '@/models/error.model';
import { handleAuthError } from './error-handler';
import { notification } from 'antd';
import { isWindow } from './utils/windows.util';
import { isDevMode } from './utils/development-mode.utils';

/**
 * Service tập trung để xử lý lỗi API
 */
export class ApiErrorService {
  /**
   * Xử lý lỗi API với các tùy chọn tùy chỉnh
   * @param error Đối tượng lỗi API
   * @param options Tùy chọn xử lý lỗi
   */
  static handleError(
    error: ApiErrorModel,
    options?: {
      showNotification?: boolean;
      customAuthHandler?: () => void;
      customNetworkHandler?: () => void;
      customServerHandler?: () => void;
      customValidationHandler?: () => void;
      onError?: (error: ApiErrorModel) => void;
    }
  ): void {
    const {
      showNotification = true,
      customAuthHandler,
      customNetworkHandler,
      customServerHandler,
      customValidationHandler,
      onError,
    } = options || {};

    // Log lỗi trong development mode
    if (isDevMode()) {
      console.error('[API Error Service]', error.toJSON());
    }

    // Gọi callback tùy chỉnh nếu có
    if (onError) {
      onError(error);
    }

    // Xử lý lỗi authentication
    if (error.isAuthError()) {
      if (customAuthHandler) {
        customAuthHandler();
      } else {
        handleAuthError(error, showNotification);
      }
      return;
    }

    // Xử lý lỗi network
    if (error.isNetworkError()) {
      if (customNetworkHandler) {
        customNetworkHandler();
      } else if (showNotification && isWindow()) {
        notification.error({
          message: 'Lỗi kết nối',
          description: error.getErrorMessage(),
          placement: 'topRight',
          duration: 5,
        });
      }
      return;
    }

    // Xử lý lỗi server (5xx)
    if (error.httpStatus >= 500) {
      if (customServerHandler) {
        customServerHandler();
      } else if (showNotification && isWindow()) {
        notification.error({
          message: 'Lỗi máy chủ',
          description: 'Máy chủ đang gặp sự cố, vui lòng thử lại sau',
          placement: 'topRight',
          duration: 5,
        });
      }
      return;
    }

    // Xử lý lỗi validation (400)
    if (error.httpStatus === 400 || error.type === 'VALIDATION_ERROR') {
      if (customValidationHandler) {
        customValidationHandler();
      } else if (showNotification && isWindow()) {
        notification.warning({
          message: 'Dữ liệu không hợp lệ',
          description: error.getErrorMessage(),
          placement: 'topRight',
          duration: 4,
        });
      }
      return;
    }

    // Xử lý lỗi 404
    if (error.httpStatus === 404) {
      if (showNotification && isWindow()) {
        notification.warning({
          message: 'Không tìm thấy',
          description: 'Tài nguyên yêu cầu không tồn tại',
          placement: 'topRight',
          duration: 4,
        });
      }
      return;
    }

    // Xử lý các lỗi khác
    if (showNotification && isWindow()) {
      notification.error({
        message: `Lỗi ${error.httpStatus}`,
        description: error.getErrorMessage(),
        placement: 'topRight',
        duration: 5,
      });
    }
  }

  /**
   * Tạo wrapper function để xử lý lỗi cho async function
   * @param fn Function cần wrap
   * @param options Tùy chọn xử lý lỗi
   * @returns Wrapped function
   */
  static withErrorHandling<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options?: {
      showNotification?: boolean;
      customAuthHandler?: () => void;
      customNetworkHandler?: () => void;
      customServerHandler?: () => void;
      customValidationHandler?: () => void;
      onError?: (error: ApiErrorModel) => void;
      onSuccess?: (result: R) => void;
      returnError?: boolean; // Trả về lỗi thay vì throw
    }
  ) {
    return async (...args: T): Promise<R | null> => {
      try {
        const result = await fn(...args);
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (error) {
        let apiError: ApiErrorModel;
        
        if (error instanceof ApiErrorModel) {
          apiError = error;
        } else {
          // Convert unknown error to ApiErrorModel
          apiError = new ApiErrorModel({
            error: {
              type: 'UNKNOWN_ERROR',
              httpStatus: 500,
              info: { apiPath: 'unknown' }
            },
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          });
        }

        ApiErrorService.handleError(apiError, options);

        if (options?.returnError) {
          return null;
        } else {
          throw apiError;
        }
      }
    };
  }

  /**
   * Xử lý lỗi cho Promise với catch
   * @param promise Promise cần xử lý
   * @param options Tùy chọn xử lý lỗi
   * @returns Promise với error handling
   */
  static async handlePromise<T>(
    promise: Promise<T>,
    options?: {
      showNotification?: boolean;
      customAuthHandler?: () => void;
      customNetworkHandler?: () => void;
      customServerHandler?: () => void;
      customValidationHandler?: () => void;
      onError?: (error: ApiErrorModel) => void;
      onSuccess?: (result: T) => void;
      returnError?: boolean;
    }
  ): Promise<T | null> {
    return promise
      .then((result) => {
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      })
      .catch((error) => {
        let apiError: ApiErrorModel;
        
        if (error instanceof ApiErrorModel) {
          apiError = error;
        } else {
          apiError = new ApiErrorModel({
            error: {
              type: 'UNKNOWN_ERROR',
              httpStatus: 500,
              info: { apiPath: 'unknown' }
            },
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          });
        }

        ApiErrorService.handleError(apiError, options);

        if (options?.returnError) {
          return null;
        } else {
          throw apiError;
        }
      });
  }
}

export default ApiErrorService;
