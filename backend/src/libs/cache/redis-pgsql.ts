import { QueryResult } from 'pg';
import { Redis } from 'ioredis';

/** 
 * 
 * @param redis: Please provide a Redis instance to handle the following logic.
 * @param key: Contains the cache key and TTL (in seconds).
 * @param callback: Please provide the query result when executing a query from the database.
 * @param constructorFn: Optional - If you want this function to return an object (with atribute and method), provide your class name (with constructor).
 * 
 * This function always returns an array of objects. If your object has only one element, don't forget to return `result[0]` if you want to return a single object.
 * @return Promise<any[] | null> 
 * 
 * @e.g:
    ...
    export class TinhTrangLaoDongModel {
      tinh_trang_lao_dong_id: string;
      ma_loai_hinh: string;

      constructor(args?: any) {
        this.tinh_trang_lao_dong_id = args?.tinh_trang_lao_dong_id;
        this.ten_tinh_trang_lao_dong = args?.ten_tinh_trang_lao_dong;
      }
    }
    ...
    export const SystemUserCacheKey: ICacheKey = {
      // Tinh trang lao dong
      tinhTrangLaoDong: () => ({
        key: "sys_schedule:sys-contact-profile:conf_tinh_trang_lao_dong",
        ttl: 30,
      }),
    };

    ...
    @Inject(REDIS_MAIN_PROVIDER) private readonly ioredis: IoRedis,
    ...
    const result = await RedisCacheOrPgQuery<any>(
        this.ioredis.getRedis, 
        UserProfileCacheKey.tinhTrangLaoDong(),
        this.repo.getAllTinhTrangLDfromProfile.bind(this.repo),
        TinhTrangLaoDongModel
    )
 * 
 * */
export async function QueryAndCacheHandler<T>(
  redis: Redis,
  ikey: { key: string; ttl?: number },
  callback: (...args: any) => Promise<QueryResult<any>>,
  constructorFn?: new (...args: any) => T,
  ...args: any[]
): Promise<any[] | null> {
  let isErrorWhenFetchRedis = false;

  try {
    const isExists = await redis.exists(ikey.key);

    if (isExists == 1) {
      // Assuming EXIST_IN_CACHE is a constant with value 1
      // console.log(`IO_REDIS: From cache ${ikey.key}`)
      const fromCache = await redis.get(ikey.key);
      const resultParsed = JSON.parse(fromCache) as [];

      if (constructorFn) {
        return resultParsed?.map((e) => new constructorFn(e));
      }
      return resultParsed;
    }
  } catch (error) {
    isErrorWhenFetchRedis = true;
    console.error(error);
  }

  try {
    const queryResult = await callback(...args);
    if (queryResult.rowCount === 0) {
      // Assuming RESULT_NOT_FOUND_FROM_DB is a constant with value 0
      return null;
    }

    let queryResultAsT = queryResult.rows;
    if (constructorFn) {
      queryResultAsT = queryResult.rows.map((e: any) => {
        return new constructorFn(e);
      });
    }

    if (isErrorWhenFetchRedis) {
      return queryResultAsT;
    }

    if (ikey.ttl) {
      await redis.setex(ikey.key, ikey.ttl, JSON.stringify(queryResultAsT));
    } else {
      await redis.set(ikey.key, JSON.stringify(queryResultAsT));
    }

    return queryResultAsT;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Xử lý query và cache cho một danh sách các id.
 *
 * QueryAndMergeCacheHandler sẽ:
 * 1. Kiểm tra cache cho từng id. Nếu có dữ liệu trong cache, parse và chuyển
 *    đổi sang dạng T.
 * 2. Lấy dữ liệu từ DB cho các id không có trong cache.
 * 3. Nạp cache cho các id vừa lấy được từ DB.
 * 4. Merge dữ liệu từ cache và DB rồi trả về.
 *
 * @param redis Instance của Redis
 * @param cacheKey Key của cache
 * @param idList Danh sách các id cần lấy
 * @param keyItem Thuộc tính định danh của mỗi đối tượng
 * @param callback Function lấy dữ liệu từ DB
 * @param fromCacheFn Function chuyển đổi dữ liệu từ cache sang dạng T
 * @param fromDatabaseFn Function chuyển đổi dữ liệu từ DB sang dạng T
 * @param ttl Thời gian tồn tại của cache (tính bằng giây)
 * @returns Danh sách các đối tượng dạng T, hoặc null nếu không có dữ liệu
 */
export async function QueryAndMergeCacheHandler<T>(
  redis: Redis,
  cacheKey: string,
  idList: (string | number)[],
  keyItem: string,
  callback: (ids: (string | number)[]) => Promise<QueryResult<any>>,
  fromCacheFn: (data: any) => T,
  fromDatabaseFn: (data: any) => T,
  ttl?: number,
): Promise<T[] | null> {
  const cachedResults: T[] = [];
  const missingIds: (string | number)[] = [];

  if (idList.length === 0) {
    return [];
  }

  // Bước 1: Kiểm tra cache cho tất cả các key cùng lúc
  try {
    // Lấy kết quả cache cho tất cả id
    const results = await redis.hmget(
      cacheKey,
      ...idList.map((id) => String(id)),
    );
    // results là mảng có thứ tự tương ứng với idList
    for (let i = 0; i < idList.length; i++) {
      const item = results[i];
      if (item) {
        cachedResults.push(fromCacheFn(JSON.parse(item)));
      } else {
        missingIds.push(idList[i]);
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ cache:', error);
    // Nếu có lỗi, lấy tất cả dữ liệu từ DB
    missingIds.push(...idList);
  }

  let dbResults: T[] = [];
  // Bước 2: Lấy dữ liệu từ DB cho những id bị thiếu (trả về null trong cache)
  try {
    if (missingIds.length > 0) {
      const queryResult = await callback(missingIds);
      if (queryResult.rowCount === 0) {
        return cachedResults.length > 0 ? cachedResults : null;
      }
      dbResults = queryResult.rows.map((row: any) => fromDatabaseFn(row));

      // Bước 3: Cập nhật cache cho các id mới lấy được từ DB sử dụng pipeline
      const pipeline = redis.pipeline();
      for (const item of dbResults) {
        // Giả sử đối tượng có thuộc tính định danh được chỉ định bởi keyItem
        const identifier = (item as any)[keyItem];
        if (identifier !== undefined) {
          pipeline.hset(cacheKey, String(identifier), JSON.stringify(item));
        }
      }
      if (ttl) {
        pipeline.expire(cacheKey, ttl);
      }
      await pipeline.exec();
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ DB:', error);
  }

  // Bước 4: Gộp kết quả từ cache và DB rồi trả về
  return [...cachedResults, ...dbResults];
}
