import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import _ from 'lodash';

@Injectable()
export class ReidisHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  async isHealth(key: string, redis: Redis) {
    let isHealthy = !_.isNil(redis);
    let mgs = '';
    try {
      mgs = await redis.client('INFO');
    } catch (error) {
      isHealthy = false;
      mgs = error.message;
    }

    const result = this.getStatus(key, isHealthy, {
      message: mgs,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('ReidisHealth check failed', result);
  }
}
