import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class EnvHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  checkEnvValid(key: string) {
    const isValid = process.env[key];
    return {
      isValid: !!isValid,
      msg: !!isValid ? 'Is exist' : 'Is not exist',
    };
  }
  async isHealth(key: string) {
    const isHealthy = true;
    const check = this.checkEnvValid(key);

    const result = this.getStatus(key, check.isValid, {
      message: check.msg,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Env check failed', result);
  }
}
