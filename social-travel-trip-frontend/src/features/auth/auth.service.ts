import Http from '@/lib/http';
import CoreAppStorageService, { StorageLocation } from '@/core/app-store/app-storage.service';
import { CookieConfigKeys } from '@/config/app-storage/cookie.config';
import { APIS } from './config';

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

export const registerService = async (payload: TRegisterPayload) => {
  try {
    const response: any = await Http.post(APIS.register, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

const setCookieToken = (token: string) => {
  CoreAppStorageService.setItem(CookieConfigKeys.features.auth.token, token, {
    location: StorageLocation.COOKIES,
  });
};

export const getAccessToken = () => {
  return CoreAppStorageService.getItem<string>(CookieConfigKeys.features.auth.token, {
    location: StorageLocation.COOKIES,
  });
};

export const isLoggedIn = () => {
  const token = getAccessToken();
  return token ? true : false;
};

export const getAuthorizationHeader = (type = 'JWT') => {
  const token = getAccessToken();
  return token ? `${type} ${token}` : '';
};
