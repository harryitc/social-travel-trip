import { Redis } from "ioredis";

export interface InvalidRedisCacheOptions {
  key?: string,
  keys?: Array<string>,
  pattern?: string,
  fields?: Array<string>
}
export async function InvalidRedisCache(
  redis: Redis,
  options: InvalidRedisCacheOptions) {
  const { keys, fields, key, pattern } = options;
  console.log(`[InvalidRedisCache] ${redis.options.host}:${redis.options.port} -> ${JSON.stringify(options)}`)
  if (key && !pattern && !fields) {
    await redis.del(key);
    return;
  }

  if (keys && !fields && !key && !pattern) {
    await Promise.all(keys.map((e) => redis.del(e)))
    return
  }

  if (!key && pattern && !fields) {
    const keysToDelete = await redis.keys(pattern);
    await Promise.all(keysToDelete.map(async (key) => {
      await redis.del(key);
    }));
    return;
  }

  if (key && fields && !pattern) {
    await Promise.all(fields.map((e) => redis.hdel(key, e)))
    return;
  }
}