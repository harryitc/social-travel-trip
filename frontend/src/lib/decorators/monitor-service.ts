import { message } from 'antd';
import { useLogStore } from '@/stores/log-store';

export function monitorService(target: any) {
  const wrapMethod = (methodName: string, originalMethod: Function, isStatic: boolean) => {
    return async function(this: any, ...args: any[]) {
      if (process.env.NODE_ENV === 'development') {
        const serviceName = `${target.name}.${methodName}`;
        const messageKey = `${serviceName}-${Date.now()}`;
        const startTime = performance.now();
        
        // Add pending log
        useLogStore.getState().addLog({
          timestamp: new Date(),
          serviceName,
          status: 'pending',
          message: `Calling ${serviceName}...`,
        });

        message.loading({
          content: `Calling ${serviceName}...`,
          key: messageKey,
          duration: 0,
        });

        try {
          const result = await originalMethod.apply(this, args);
          const duration = Number((performance.now() - startTime).toFixed(2));
          
          // Add success log
          useLogStore.getState().addLog({
            timestamp: new Date(),
            serviceName,
            status: 'success',
            duration,
            message: `✓ ${serviceName}`,
          });

          message.success({
            content: `✓ ${serviceName} (${duration}ms)`,
            key: messageKey,
            duration: 2,
          });

          return result;
        } catch (error: any) {
          // Add error log
          useLogStore.getState().addLog({
            timestamp: new Date(),
            serviceName,
            status: 'error',
            duration: Number((performance.now() - startTime).toFixed(2)),
            message: `✗ ${serviceName}`,
            error: error.message,
          });

          message.error({
            content: `✗ ${serviceName}: ${error.message}`,
            key: messageKey,
            duration: 3,
          });
          throw error;
        }
      } else {
        return await originalMethod.apply(this, args);
      }
    };
  };

  // Wrap static methods
  Object.getOwnPropertyNames(target).forEach((methodName) => {
    if (methodName === 'prototype' || methodName === 'length' || methodName === 'name') return;
    const originalMethod = target[methodName];
    if (typeof originalMethod !== 'function') return;
    target[methodName] = wrapMethod(methodName, originalMethod, true);
  });

  // Wrap instance methods
  Object.getOwnPropertyNames(target.prototype).forEach((methodName) => {
    if (methodName === 'constructor') return;
    const originalMethod = target.prototype[methodName];
    if (typeof originalMethod !== 'function') return;
    target.prototype[methodName] = wrapMethod(methodName, originalMethod, false);
  });

  return target;
}
