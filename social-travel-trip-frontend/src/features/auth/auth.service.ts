import Http from '@/lib/http';
import CoreAppStorageService, { StorageLocation } from '@/core/app-store/app-storage.service';
import { CookieConfigKeys } from '@/config/app-storage/cookie.config';
import { APIS, TConfirmResetPasswordPayload, TLoginPayload, TRegisterPayload, TResetPasswordPayload } from './config';

/**
 * Login user with username and password
 * @param payload Login credentials
 * @returns Authentication response with access token
 */
export const loginService = async (payload: TLoginPayload) => {
  try {
    const response: any = await Http.post(APIS.login, payload);

    if (!response.access_token) {
      return response;
    }
    setCookieToken(response.access_token);

    return response;
  } catch (error) {
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
 * Logout user by removing token
 */
export const logoutService = () => {
  CoreAppStorageService.removeItems([CookieConfigKeys.features.auth.token], {
    location: StorageLocation.COOKIES,
  });
  window.location.href = '/auth/sign-in';
};
