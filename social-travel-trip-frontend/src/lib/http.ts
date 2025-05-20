import { environment } from '@/config/environment';
import axios from 'axios';
import { isWindow } from './utils/windows.util';
import { getAuthorizationHeader } from '@/features/auth/auth.service';

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
  (error) => {
    // Xử lý lỗi khi nhận phản hồi
    return Promise.reject(error);
  },
);
export default Http;
