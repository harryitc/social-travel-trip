import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const BULL_QUEUE_CONNECTION_KEY = 'BULL_QUEUE_CONNECTION_KEY';
export const QueueRedisConfig = registerAs('redisBullQueue', () => ({
  host: process.env.IO_REDIS_QUEUE_HOST,
  port: +process.env.IO_REDIS_QUEUE_PORT,
  db: +process.env.IO_REDIS_QUEUE_DB_NAME,
}));

export const RedisQueueEnvConfValSchema = {
  QUEUE_REDIS_MAIN_HOST: Joi?.string(),
  QUEUE_REDIS_MAIN_PORT: Joi?.number(),
};

// Truwongf howpj cos nhieu ket noi den queue khac nhau thi jhi bao them