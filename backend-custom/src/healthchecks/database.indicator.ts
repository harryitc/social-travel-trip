import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import _ from 'lodash';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }
  async isHealthy(
    key: string,
    pool: PgSQLConnectionPool,
  ): Promise<HealthIndicatorResult> {
    let isHealthy = !_.isNil(pool);
    let message = 'Ping check database success!';

    try {
      await pool.execute('SELECT 1');
    } catch (error) {
      message = error.message;
      isHealthy = false;
    }

    const result = this.getStatus(key, isHealthy, {
      message: message,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('DatabaseHealth check failed', result);
  }
}
