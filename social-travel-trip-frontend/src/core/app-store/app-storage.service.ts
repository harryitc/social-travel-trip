import { LocalStorageConfigKeys } from "@/config/app-storage/local-storage.config";
import CoreCookieService from "./cookie/core-cookie.service";
import CoreLocalStorageService from "./local-storage/core-local-storage.service";
import CoreSessionStorageService from "./session-storage/core-session-storage.service";
import { SessionStorageConfigKeys } from "@/config/app-storage/session-storage.config";
import { CookieConfigKeys } from "@/config/app-storage/cookie.config";
import { CacheStorageConfigKeys } from "@/config/app-storage/cache.config";
import KeyStorageHelper, {
  TDuplicateEntry,
} from "@/lib/helpers/key-storage.helper";

export enum StorageLocation {
  LOCAL_STORAGE = "LOCAL_STORAGE",
  SESSION_STORAGE = "SESSION_STORAGE",
  COOKIES = "COOKIES",
}

type Options = {
  location: StorageLocation;
  expireInSeconds?: number;
};

const getItem = <T>(key: string, options: Options): T | any => {
  switch (options.location) {
    case StorageLocation.LOCAL_STORAGE:
      return CoreLocalStorageService.getItem<T>(key);
    case StorageLocation.SESSION_STORAGE:
      return CoreSessionStorageService.getItem<T>(key);
    case StorageLocation.COOKIES:
      return CoreCookieService.getCookie(key);
    default:
      break;
  }
};

const setItem = <T>(key: string, value: T | any, options: Options): void => {
  switch (options.location) {
    case StorageLocation.LOCAL_STORAGE:
      CoreLocalStorageService.setItem<T>(key, value);
      break;
    case StorageLocation.SESSION_STORAGE:
      CoreSessionStorageService.setItem<T>(key, value);
      break;
    case StorageLocation.COOKIES:
      CoreCookieService.setCookie(key, value, options.expireInSeconds);
      break;
    default:
      break;
  }
};

const removeItems = (keys: string[], options: Options): void => {
  switch (options.location) {
    case StorageLocation.LOCAL_STORAGE:
      CoreLocalStorageService.removeItems(keys);
      break;
    case StorageLocation.SESSION_STORAGE:
      CoreSessionStorageService.removeItems(keys);
      break;
    case StorageLocation.COOKIES:
      CoreCookieService.deleteCookies(keys);
      break;
    default:
      break;
  }
};

const removeAllIn = (options: Options): void => {
  switch (options.location) {
    case StorageLocation.LOCAL_STORAGE:
      CoreLocalStorageService.clear();
      break;
    case StorageLocation.SESSION_STORAGE:
      CoreSessionStorageService.clear();
      break;
    case StorageLocation.COOKIES:
      throw new Error(`Method not allowed`);
    default:
      break;
  }
};

const verifyStorageKey = () => {
  checkAndThrowForDuplicateKeys(LocalStorageConfigKeys);
  checkAndThrowForDuplicateKeys(SessionStorageConfigKeys);
  checkAndThrowForDuplicateKeys(CookieConfigKeys);
  checkAndThrowForDuplicateKeys(CacheStorageConfigKeys);

  function checkAndThrowForDuplicateKeys(keys: object) {
    const duplicatedKey = KeyStorageHelper.findDuplicateObjects(keys);
    if (duplicatedKey.length > 0) {
      throwErrorWhenDuplicatedKey(duplicatedKey);
    }
  }

  function throwErrorWhenDuplicatedKey(duplicateValue: TDuplicateEntry[]) {
    duplicateValue.forEach((value) => {
      throw new Error(
        `Lỗi trùng giá trị ${value.key} trong các khóa ${value.values}`
      );
    });
  }
};

const CoreAppStorageService = {
  setItem,
  getItem,
  removeItems,
  removeAllIn,
  verifyStorageKey,
};

export default CoreAppStorageService;
