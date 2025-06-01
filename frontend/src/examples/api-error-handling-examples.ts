/**
 * Ví dụ về cách sử dụng error handling mới trong các service
 */

import Http from '@/lib/http';
import ApiErrorService from '@/lib/api-error-service';
import { useApiError } from '@/lib/hooks/use-api-error';
import { API_ENDPOINT } from '@/config/api.config';

// ===== CÁCH 1: Sử dụng HTTP Interceptor (Tự động) =====
// HTTP interceptor sẽ tự động xử lý lỗi authentication và các lỗi cơ bản

export const exampleService1 = {
  async getPosts() {
    try {
      // HTTP interceptor sẽ tự động:
      // - Thêm token vào header
      // - Xử lý lỗi 401/403 -> logout tự động
      // - Hiển thị thông báo lỗi network, server
      const response = await Http.get(`${API_ENDPOINT.social_travel_trip}/posts`);
      return response;
    } catch (error) {
      // Lỗi đã được xử lý bởi interceptor
      // Chỉ cần throw lại hoặc xử lý logic riêng
      console.error('Service error:', error);
      throw error;
    }
  }
};

// ===== CÁCH 2: Sử dụng ApiErrorService.withErrorHandling =====
// Wrap function để xử lý lỗi tùy chỉnh

export const exampleService2 = {
  // Xử lý lỗi với tùy chọn mặc định
  createPost: ApiErrorService.withErrorHandling(
    async (postData: any) => {
      const response = await Http.post(`${API_ENDPOINT.social_travel_trip}/posts/create`, postData);
      return response;
    },
    {
      showNotification: true, // Hiển thị thông báo lỗi
      onSuccess: (result) => {
        console.log('Post created successfully:', result);
      }
    }
  ),

  // Xử lý lỗi với custom handler
  updatePost: ApiErrorService.withErrorHandling(
    async (postId: string, postData: any) => {
      const response = await Http.put(`${API_ENDPOINT.social_travel_trip}/posts/${postId}`, postData);
      return response;
    },
    {
      showNotification: false, // Không hiển thị thông báo tự động
      customValidationHandler: () => {
        // Xử lý lỗi validation tùy chỉnh
        console.log('Custom validation error handling');
      },
      onError: (error) => {
        // Xử lý lỗi tùy chỉnh
        console.error('Custom error handling:', error);
      }
    }
  ),

  // Trả về null thay vì throw error
  deletePost: ApiErrorService.withErrorHandling(
    async (postId: string) => {
      await Http.delete(`${API_ENDPOINT.social_travel_trip}/posts/${postId}`);
      return { success: true };
    },
    {
      returnError: true, // Trả về null nếu có lỗi thay vì throw
      onSuccess: () => {
        console.log('Post deleted successfully');
      }
    }
  )
};

// ===== CÁCH 3: Sử dụng ApiErrorService.handlePromise =====
// Xử lý lỗi cho Promise có sẵn

export const exampleService3 = {
  async getPostDetails(postId: string) {
    const promise = Http.get(`${API_ENDPOINT.social_travel_trip}/posts/${postId}`);
    
    return ApiErrorService.handlePromise(promise, {
      showNotification: true,
      onSuccess: (result) => {
        console.log('Post details loaded:', result);
      },
      customAuthHandler: () => {
        // Xử lý lỗi auth tùy chỉnh (không logout tự động)
        console.log('Custom auth error - maybe show login modal');
      }
    });
  }
};

// ===== CÁCH 4: Sử dụng trong React Component với useApiError hook =====

export const ExampleComponent = () => {
  const { handleError, withErrorHandling } = useApiError();

  // Sử dụng hook để xử lý lỗi
  const handleCreatePost = async (postData: any) => {
    try {
      const response = await Http.post(`${API_ENDPOINT.social_travel_trip}/posts/create`, postData);
      console.log('Post created:', response);
    } catch (error: any) {
      // Sử dụng hook để xử lý lỗi
      handleError(error, {
        showNotification: true,
        redirectOnAuthError: true,
        onValidationError: () => {
          // Xử lý lỗi validation trong component
          console.log('Validation error in component');
        }
      });
    }
  };

  // Hoặc sử dụng withErrorHandling từ hook
  const handleUpdatePost = withErrorHandling(
    async (postId: string, postData: any) => {
      const response = await Http.put(`${API_ENDPOINT.social_travel_trip}/posts/${postId}`, postData);
      return response;
    },
    {
      showNotification: true,
      onSuccess: (result) => {
        console.log('Post updated in component:', result);
      }
    }
  );

  return null; // Component JSX here
};

// ===== CÁCH 5: Xử lý lỗi thủ công với ApiErrorService.handleError =====

export const exampleService5 = {
  async complexOperation(data: any) {
    try {
      const response = await Http.post(`${API_ENDPOINT.social_travel_trip}/complex`, data);
      return response;
    } catch (error: any) {
      // Xử lý lỗi thủ công
      ApiErrorService.handleError(error, {
        showNotification: false, // Không hiển thị thông báo tự động
        customAuthHandler: () => {
          // Logic tùy chỉnh cho lỗi auth
          console.log('Custom auth handling');
        },
        customNetworkHandler: () => {
          // Logic tùy chỉnh cho lỗi network
          console.log('Custom network error handling');
        },
        onError: (apiError) => {
          // Logic xử lý lỗi tùy chỉnh
          if (apiError.httpStatus === 409) {
            console.log('Conflict error - handle specifically');
          }
        }
      });
      
      // Có thể throw lại hoặc return giá trị mặc định
      throw error;
    }
  }
};

// ===== TÓM TẮT CÁC CÁCH SỬ DỤNG =====

/*
1. HTTP Interceptor (Tự động):
   - Tự động xử lý lỗi auth -> logout
   - Hiển thị thông báo lỗi cơ bản
   - Không cần code thêm

2. ApiErrorService.withErrorHandling:
   - Wrap function để xử lý lỗi
   - Tùy chỉnh handler cho từng loại lỗi
   - Có thể trả về null thay vì throw

3. ApiErrorService.handlePromise:
   - Xử lý lỗi cho Promise có sẵn
   - Tương tự withErrorHandling

4. useApiError hook (trong React):
   - Sử dụng trong component
   - Tích hợp với React lifecycle
   - Có thể redirect với router

5. ApiErrorService.handleError (thủ công):
   - Xử lý lỗi hoàn toàn tùy chỉnh
   - Kiểm soát chi tiết nhất
*/
