import { environment } from '@/config/environment';
import axios, { AxiosError } from 'axios';
import { isWindow } from './utils/windows.util';
import { getAuthorizationHeader, logoutService } from '@/features/auth/auth.service';
import { ApiErrorModel } from '@/models/error.model';

const Http = axios.create({
  timeout: environment.aplication.http.timeout,
});

// Đăng ký interceptor cho yêu cầu
Http.interceptors.request.use(
  async (config) => {
    // Xử lý trước khi gửi yêu cầu
    // Ví dụ: thêm token vào header
    config.headers.Authorization = getAuthorizationHeader();
    return config;
  },
  (error) => {
    // Xử lý lỗi khi gửi yêu cầu
    return Promise.reject(error);
  },
);

// Đăng ký interceptor cho phản hồi
Http.interceptors.response.use(
  (response) => {
    // Xử lý phản hồi trước khi trả về dữ liệu cho thành phần gọi
    return response.data;
  },
  async (error: AxiosError) => {
    // Xử lý lỗi khi nhận phản hồi
    console.error('HTTP Error:', error);

    // Tạo ApiErrorModel từ response error
    let apiError: ApiErrorModel;

    if (error.response?.data) {
      // Lỗi từ server với response data
      apiError = ApiErrorModel.fromResponse(error.response.data);
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // Lỗi timeout
      apiError = new ApiErrorModel({
        error: {
          type: 'TIMEOUT_ERROR',
          httpStatus: 408,
          info: { apiPath: error.config?.url || 'unknown' }
        },
        message: 'Kết nối đến máy chủ quá lâu, vui lòng thử lại sau'
      });
    } else if (!error.response) {
      // Lỗi network
      apiError = new ApiErrorModel({
        error: {
          type: 'NETWORK_ERROR',
          httpStatus: 0,
          info: { apiPath: error.config?.url || 'unknown' }
        },
        message: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng'
      });
    } else {
      // Lỗi HTTP khác
      apiError = new ApiErrorModel({
        error: {
          type: 'UNKNOWN_ERROR',
          httpStatus: error.response.status,
          info: { apiPath: error.config?.url || 'unknown' }
        },
        message: error.message || 'Đã xảy ra lỗi không xác định'
      });
    }

    // Chỉ xử lý lỗi authentication tự động - các lỗi khác để component xử lý
    if (apiError.isAuthError()) {
      console.warn('Authentication error detected, logging out user');

      if (isWindow()) {
        // Logout và chuyển hướng - không hiển thị notification ở đây
        // Component có thể hiển thị thông báo trước khi logout nếu cần
        setTimeout(() => {
          logoutService();
        }, 500); // Delay ngắn để component có thể xử lý
      }

      return Promise.reject(apiError);
    }

    // Các lỗi khác sẽ được throw về component để xử lý
    // Component sẽ quyết định cách hiển thị và xử lý lỗi

    return Promise.reject(apiError);
  },
);

export default Http;
