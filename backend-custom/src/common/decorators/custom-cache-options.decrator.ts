import { SetMetadata } from '@nestjs/common';

// permitAllUser = Không phân biệt user với loại dữ liệu này
export interface ICustomCacheOptions {
  key?: string, 
  permitAllUser?: boolean,  
  ttl?: number  // second
}
export const CUSTOM_HTTP_CACHE_OPTIONS = '___CUSTOM_HTTP_CACHE_OPTIONS';
export const CustomCacheOptions = (opts: ICustomCacheOptions) =>
  SetMetadata(CUSTOM_HTTP_CACHE_OPTIONS, opts);
