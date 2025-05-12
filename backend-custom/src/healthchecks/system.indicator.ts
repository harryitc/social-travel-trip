import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import * as os from 'os';

@Injectable()
export class SystemHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  getMemoryUsage() {
    const totalMemory = os.totalmem() / (1024 * 1024); // Convert to MB
    const freeMemory = os.freemem() / (1024 * 1024); // Convert to MB
    const usedMemory = totalMemory - freeMemory;
    const usagePercent = (usedMemory / totalMemory) * 100;
    const freePercent = (freeMemory / totalMemory) * 100;

    return {
      totalMemoryMB: +totalMemory.toFixed(2),
      freeMemoryMB: +freeMemory.toFixed(2),
      usedMemoryMB: +usedMemory.toFixed(2),
      memoryUsagePercent: +usagePercent.toFixed(2),
      freeMemoryPercent: +freePercent.toFixed(2),
    };
  }
  async isHealth(key: string, limit: number) {
    const isHealthy = true;
    const mgs = this.getMemoryUsage();

    const result = this.getStatus(key, mgs.memoryUsagePercent < limit, {
      message: mgs,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('ReidisHealth check failed', result);
  }
}
