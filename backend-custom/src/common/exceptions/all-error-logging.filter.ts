/**
 * Sau khi vượt qua middleware. Quá trình vận hành có lỗi gì sẽ kiểm soát ở đây
 * Log ra lỗi và save lại ở dâu đó để giám sát.
 */
// error-logging.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllErrorLoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllErrorLoggingFilter.name);

  constructor(public readonly configService: ConfigService) {}

  catch(exception: HttpException | Error | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const getResponseMessage = (exception: HttpException): string => {
      const response = exception?.getResponse();
      if (!response) return '';

      const message = response['message'];
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      return typeof message === 'string' ? message : '';
    };

    const message = exception.message || ''; //Lấy dữ liệu lỗi từ custom-http-exceptions.ts
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errMessage = `Unhandled Exception: ${exception.name} - ${message}`;
    let messageDTO = ''; // Từ luồng không phải trong nhóm custom-http-exceptions.ts

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errMessage = `HTTP Exception: ${status} - ${message}`;
      messageDTO = getResponseMessage(exception);
    }

    this.logger.error(errMessage, exception.stack);
    this.logger.error(JSON.stringify(exception));

    if (this.configService.get('appConfig.enableCentralizedLogs')) {
      // push dữ liệu đến kho chung cho việc giám sát chỗ này...
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorMessage: errMessage,
      reasons: {
        message: messageDTO || message,
        options: exception.options,
      },
    });
  }
}
