import Http from '@/lib/http';
import CoreAppStorageService, { StorageLocation } from '@/core/app-store/app-storage.service';
import { CookieConfigKeys } from '@/config/app-storage/cookie.config';
import { APIS, TConfirmResetPasswordPayload, TLoginPayload, TRegisterPayload, TResetPasswordPayload } from './config';

/**
 * Login user with username and password
 * @param payload Login credentials
 * @returns Authentication response with access token and user info
 */
export const loginService = async (payload: TLoginPayload) => {
  try {
    const response: any = await Http.post(APIS.login, payload);
    console.log('Login response:', response);

    if (!response.access_token) {
      return response;
    }

    // Lưu token vào cookie
    setCookieToken(response.access_token);

    // Lưu thông tin người dùng vào cookie
    if (response.user) {
      console.log('Setting user info:', response.user);
      setUserInfo(response.user);
    } else {
      console.warn('No user info in response');
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param payload Registration data
 * @returns User data
 */
export const registerService = async (payload: TRegisterPayload) => {
  try {
    const response: any = await Http.post(APIS.register, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param payload Email for password reset
 * @returns Success message
 */
export const resetPasswordService = async (payload: TResetPasswordPayload) => {
  try {
    const response: any = await Http.post(APIS.resetPassword, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm password reset with token and new password
 * @param payload Token and new password
 * @returns Success message
 */
export const confirmResetPasswordService = async (payload: TConfirmResetPasswordPayload) => {
  try {
    const response: any = await Http.post(APIS.confirmResetPassword, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Set authentication token in cookies
 * @param token JWT token
 */
const setCookieToken = (token: string) => {
  CoreAppStorageService.setItem(CookieConfigKeys.features.auth.token, token, {
    location: StorageLocation.COOKIES,
  });
};

/**
 * Set user information in cookies
 * @param user User information
 */
const setUserInfo = (user: any) => {
  CoreAppStorageService.setItem(CookieConfigKeys.features.auth.user, JSON.stringify(user), {
    location: StorageLocation.COOKIES,
  });
};

/**
 * Get authentication token from cookies
 * @returns JWT token or null
 */
export const getAccessToken = () => {
  return CoreAppStorageService.getItem<string>(CookieConfigKeys.features.auth.token, {
    location: StorageLocation.COOKIES,
  });
};

/**
 * Check if user is logged in
 * @returns True if logged in, false otherwise
 */
export const isLoggedIn = () => {
  const token = getAccessToken();
  return token ? true : false;
};

/**
 * Get authorization header with token
 * @param type Token type (default: JWT)
 * @returns Authorization header value
 */
export const getAuthorizationHeader = (type = 'Bearer') => {
  const token = getAccessToken();
  return token ? `${type} ${token}` : '';
};

/**
 * Get user information from cookies
 * @returns User information or null
 */
export const getUserInfo = () => {
  // Kiểm tra cả hai vị trí lưu trữ có thể
  const userJson = CoreAppStorageService.getItem<string>(CookieConfigKeys.features.auth.user, {
    location: StorageLocation.COOKIES,
  });

  const resultJson = CoreAppStorageService.getItem<string>(CookieConfigKeys.features.auth.result, {
    location: StorageLocation.COOKIES,
  });

  console.log('getUserInfo - userJson:', userJson);
  console.log('getUserInfo - resultJson:', resultJson);

  if (!userJson && !resultJson) return null;

  try {
    if (userJson) {
      return JSON.parse(userJson);
    } else if (resultJson) {
      const result = JSON.parse(resultJson);
      // Chuyển đổi định dạng nếu cần
      return {
        username: result.username || '',
        full_name: result.fullname || '',
        email: result.email || '',
        avatar_url: result.avatar || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

/**
 * Logout user by removing token and user info
 */
export const logoutService = () => {
  // Xóa tất cả các key liên quan đến xác thực
  CoreAppStorageService.removeItems([
    CookieConfigKeys.features.auth.token,
    CookieConfigKeys.features.auth.user,
    CookieConfigKeys.features.auth.result
  ], {
    location: StorageLocation.COOKIES,
  });
  console.log('User logged out, cookies cleared');
  window.location.href = '/auth/sign-in';
};
