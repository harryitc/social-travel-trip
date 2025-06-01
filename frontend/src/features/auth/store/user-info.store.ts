import { CookieConfigKeys } from '@/config/app-storage/cookie.config';
import CoreAppStorageService, { StorageLocation } from '@/core/app-store/app-storage.service';
import { create } from 'zustand';

const storageScope = { location: StorageLocation.COOKIES };
interface UserInfo {
  fullname: string;
  email: string;
  avatar: string;
  accessToken: string;
}

interface UserInfoState extends UserInfo {
  setUserInfo: (args: UserInfo) => void;
  clearUserInfo: () => void;
  isLoggedIn: () => boolean;
}

const getUserInfoFromCookies = (): UserInfo => {
  try {
    const storedUserInfo =
      CoreAppStorageService.getItem(CookieConfigKeys.features.auth.result, storageScope) || '{}';
    const accessToken =
      CoreAppStorageService.getItem(CookieConfigKeys.features.auth.token, storageScope) || '';
    const {
      fullname = '',
      email = '',
      avatar = '',
    } = JSON.parse(storedUserInfo);
    return { fullname, email, avatar, accessToken };
  } catch (error) {
    console.error('Error parsing user info from cookies:', error);
    return { fullname: '', email: '', avatar: '', accessToken: '' };
  }
};

const setUserInfoInCookies = (args: UserInfo) => {
  CoreAppStorageService.setItem(
    CookieConfigKeys.features.auth.result,
    JSON.stringify(args),
    storageScope,
  );
  CoreAppStorageService.setItem(
    CookieConfigKeys.features.auth.token,
    args.accessToken,
    storageScope,
  );
};

const clearUserInfoInCookies = () => {
  CoreAppStorageService.removeItems(
    [CookieConfigKeys.features.auth.result, CookieConfigKeys.features.auth.token],
    storageScope,
  );
};

const useUserInfoStore = create<UserInfoState>((set) => ({
  ...getUserInfoFromCookies(),

  setUserInfo: (args: UserInfo) => {
    setUserInfoInCookies(args);
    set(args);
  },

  clearUserInfo: () => {
    clearUserInfoInCookies();
    set({ fullname: '', email: '', avatar: '', accessToken: '' });
  },

  isLoggedIn: () => {
    const userInfo = getUserInfoFromCookies();
    return userInfo.accessToken.length > 0;
  },
}));

export default useUserInfoStore;
