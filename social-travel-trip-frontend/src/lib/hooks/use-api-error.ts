import { useCallback } from 'react';
import { ApiErrorModel } from '@/models/error.model';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';

/**
 * Hook để xử lý lỗi API trong component React
 * @returns Các hàm xử lý lỗi API
 */
export const useApiError = () => {
  const router = useRouter();

  /**
   * Xử lý lỗi API
   * @param error Đối tượng lỗi API
   * @param options Tùy chọn xử lý lỗi
   */
  const handleError = useCallback(
    (
      error: ApiErrorModel,
      options?: {
        showNotification?: boolean;
        redirectOnAuthError?: boolean;
        onAuthError?: () => void;
        onNetworkError?: () => void;
        onServerError?: () => void;
        onValidationError?: () => void;
        onBusinessError?: () => void;
        onOtherError?: () => void;
      }
    ) => {
      const {
        showNotification = true,
        redirectOnAuthError = true,
        onAuthError,
        onNetworkError,
        onServerError,
        onValidationError,
        onBusinessError,
        onOtherError,
      } = options || {};

      // Xử lý lỗi xác thực
      if (error.isAuthError()) {
        if (onAuthError) {
          onAuthError();
        } else if (redirectOnAuthError) {
          router.push('/auth/login');
        }
        return;
      }

      // Xử lý lỗi mạng
      if (error.isNetworkError()) {
        if (onNetworkError) {
          onNetworkError();
        } else if (showNotification) {
          notification.error({
            message: 'Lỗi kết nối',
            description: error.getErrorMessage(),
            placement: 'topRight',
          });
        }
        return;
      }

      // Xử lý lỗi máy chủ
      if (error.isServerError()) {
        if (onServerError) {
          onServerError();
        } else if (showNotification) {
          notification.error({
            message: 'Lỗi máy chủ',
            description: error.getErrorMessage(),
            placement: 'topRight',
          });
        }
        return;
      }

      // Xử lý lỗi validation
      if (error.isValidationError()) {
        if (onValidationError) {
          onValidationError();
        } else if (showNotification) {
          notification.warning({
            message: 'Dữ liệu không hợp lệ',
            description: error.getErrorMessage(),
            placement: 'topRight',
          });
        }
        return;
      }

      // Xử lý lỗi business logic
      if (error.isBusinessError()) {
        if (onBusinessError) {
          onBusinessError();
        } else if (showNotification) {
          notification.warning({
            message: 'Không thể thực hiện',
            description: error.getErrorMessage(),
            placement: 'topRight',
          });
        }
        return;
      }

      // Xử lý các loại lỗi khác
      if (onOtherError) {
        onOtherError();
      } else if (showNotification) {
        notification.error({
          message: 'Lỗi',
          description: error.getErrorMessage(),
          placement: 'topRight',
        });
      }
    },
    [router]
  );

  /**
   * Tạo một hàm try-catch để xử lý lỗi API
   * @param fn Hàm cần thực thi
   * @param options Tùy chọn xử lý lỗi
   * @returns Hàm đã được bọc try-catch
   */
  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      options?: {
        showNotification?: boolean;
        redirectOnAuthError?: boolean;
        onAuthError?: () => void;
        onNetworkError?: () => void;
        onServerError?: () => void;
        onValidationError?: () => void;
        onBusinessError?: () => void;
        onOtherError?: () => void;
        onError?: (error: ApiErrorModel) => void;
        returnError?: boolean; // Thêm option để trả về lỗi cho component
      }
    ) => {
      return async (...args: T): Promise<R | undefined | { error: ApiErrorModel, data: undefined }> => {
        try {
          const result = await fn(...args);
          return result;
        } catch (error) {
          const apiError = error as ApiErrorModel;

          if (options?.onError) {
            options.onError(apiError);
          }

          // Nếu returnError=true, trả về lỗi cho component xử lý
          if (options?.returnError) {
            // Vẫn xử lý lỗi mặc định nếu showNotification=true
            if (options.showNotification !== false) {
              handleError(apiError, { ...options, showNotification: true });
            }
            return { error: apiError, data: undefined };
          }

          // Xử lý lỗi mặc định
          handleError(apiError, options);
          return undefined;
        }
      };
    },
    [handleError]
  );

  /**
   * Helper để trích xuất dữ liệu và lỗi từ kết quả
   * @param result Kết quả từ hàm withErrorHandling
   * @returns Object chứa dữ liệu và lỗi
   */
  const extractResult = useCallback(<T>(result: T | undefined | { error: ApiErrorModel, data: undefined }) => {
    if (result === undefined) {
      return { data: undefined, error: undefined };
    }

    if (result && typeof result === 'object' && 'error' in result) {
      return { data: undefined, error: (result as { error: ApiErrorModel }).error };
    }

    return { data: result as T, error: undefined };
  }, []);

  return {
    handleError,
    withErrorHandling,
    extractResult,
  };
};
