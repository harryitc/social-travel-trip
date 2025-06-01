import { InvalidRedisCache, InvalidRedisCacheOptions } from './invalid-redis-cache';
import { Redis } from 'ioredis';

// Mock Redis instance
const mockRedis: Redis = {
  del: jest.fn(),
  keys: jest.fn().mockReturnValue(['key1', 'key2']),
  hdel: jest.fn(),
  options: {
    host: 'localhost',
    port: 6379,
  },
} as any;

// Test cases
describe('InvalidRedisCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete single key', async () => {
    const options: InvalidRedisCacheOptions = {
      key: 'key1',
    };

    await InvalidRedisCache(mockRedis, options);

    expect(mockRedis.del).toHaveBeenCalledWith('key1');
  });

  it('should delete multiple keys', async () => {
    const options: InvalidRedisCacheOptions = {
      keys: ['key1', 'key2'],
    };

    await InvalidRedisCache(mockRedis, options);

    expect(mockRedis.del).toHaveBeenCalledWith('key1');
    expect(mockRedis.del).toHaveBeenCalledWith('key2');
  });

  it('should delete keys by pattern', async () => {
    const options: InvalidRedisCacheOptions = {
      pattern: 'pattern:*',
    };

    await InvalidRedisCache(mockRedis, options);

    expect(mockRedis.keys).toHaveBeenCalledWith('pattern:*');
    expect(mockRedis.del).toHaveBeenCalledWith('key1');
    expect(mockRedis.del).toHaveBeenCalledWith('key2');
  });

  it('should delete fields from hash', async () => {
    const options: InvalidRedisCacheOptions = {
      key: 'hashKey',
      fields: ['field1', 'field2'],
    };

    await InvalidRedisCache(mockRedis, options);

    expect(mockRedis.hdel).toHaveBeenCalledWith('hashKey', 'field1');
    expect(mockRedis.hdel).toHaveBeenCalledWith('hashKey', 'field2');
  });
});
