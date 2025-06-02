import { Logger } from '@nestjs/common';

/**
 * Xu ly loi unhandledRejection de tranh crash application
 * khi co loi throw ra.
 * 
 * Truong hop se bi:
 * - Dung promise ma promise throw error.
 */
export const OnUnhandledRejection = () => {
  const logger = new Logger('OnUnhandledRejection');
  process
    .on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection reason:', reason);
    })
    .on('uncaughtException', (err) => {
      logger.error(err);
    });
};