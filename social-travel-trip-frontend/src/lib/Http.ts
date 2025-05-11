import { environment } from '@/config/environment';
// import { getAuthorizationHeader } from '@/features/auth/services/auth.service';
import axios, { AxiosError } from 'axios';
import { isWindow } from './utils/windows.util';
import { ApiErrorModel } from '@/models/error.model';
import { handleApiError } from '@/lib/error-handler';

const Http = axios.create({
  timeout: environment.aplication.http.timeout,
});

// Đăng ký interceptor cho yêu cầu
Http.interceptors.request.use(
  async (config) => {
    // Xử lý trước khi gửi yêu cầu
    // Ví dụ: thêm token vào header
    // config.headers.Authorization = getAuthorizationHeader();
    // config.headers['App-Key'] = environment.auth.app_key;
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
    // return response.data;
    return response;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject(error);
    // if (error.response?.data) {
    //   const apiError = ApiErrorModel.fromResponse(error.response.data);

    //   // Xử lý lỗi API thông qua error handler
    //   handleApiError(apiError);

    //   return Promise.reject(apiError);
    // }

    // // Xử lý lỗi không có response (network error, timeout, etc.)
    // const genericError = new ApiErrorModel({
    //   error: {
    //     type: 'NETWORK_ERROR',
    //     httpStatus: 0,
    //     info: { apiPath: error.config?.url || 'unknown' }
    //   },
    //   message: error.message || 'Network error occurred'
    // });

    // handleApiError(genericError);
    // return Promise.reject(genericError);
  }
);

export const attachToken = (config: any, token: string | null) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export default Http;
