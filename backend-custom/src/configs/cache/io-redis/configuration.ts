import { registerAs } from '@nestjs/config';

export const REDIS_MAIN_PROVIDER = 'REDIS_MAIN_PROVIDER';
export const IoRedisMainConfig = registerAs('ioRedisMain', () => ({
  max: +process.env.IO_REDIS_MAIN_MAX_CLIENT,
  host: process.env.IO_REDIS_MAIN_HOST,
  port: +process.env.IO_REDIS_MAIN_PORT,
  name: process.env.IO_REDIS_MAIN_DB_NAME,
}));
