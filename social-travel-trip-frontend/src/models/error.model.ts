import { ERROR_KEY } from '@/error.config';

export interface ErrorInfo {
  apiPath: string;
  [key: string]: any;
}

// Format lỗi thứ nhất
export interface ErrorResponse {
  error?: {
    type: string;
    httpStatus: number;
    info: ErrorInfo;
  };
  message: string;
  stack?: string;
}

// Format lỗi thứ hai
export interface SystemErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  errorMessage: string;
  reasons?: {
    message: string;
    [key: string]: any;
  };
}

export class ApiErrorModel {
  type: string;
  httpStatus: number;
  message: string;
  apiPath: string;
  stack?: string;
  timestamp?: string;

  constructor(error: ErrorResponse | SystemErrorResponse) {
    if (this.isSystemError(error)) {
      // Xử lý format lỗi thứ hai
      this.type = 'SYSTEM_ERROR';
      this.httpStatus = error.statusCode;
      this.message = error.errorMessage;
      this.apiPath = error.path;
      this.timestamp = error.timestamp;
    } else {
      // Xử lý format lỗi thứ nhất
      this.type = error.error?.type || 'UNKNOWN_ERROR';
      this.httpStatus = error.error?.httpStatus || 500;
      this.message = error.message;
      this.apiPath = error.error?.info?.apiPath || 'unknown';
      this.stack = error.stack;
    }
  }

  private isSystemError(error: any): error is SystemErrorResponse {
    return 'statusCode' in error && 'errorMessage' in error;
  }

  static fromResponse(response: any): ApiErrorModel {
    if (!response) {
      return new ApiErrorModel({
        error: {
          type: 'UNKNOWN_ERROR',
          httpStatus: 500,
          info: {
            apiPath: 'unknown',
          },
        },
        message: 'Unknown error occurred',
      });
    }
    return new ApiErrorModel(response);
  }

  isAuthError(): boolean {
    return this.httpStatus === 401 ||
           this.type === ERROR_KEY.INVALID_TOKEN ||
           this.type === ERROR_KEY.NO_TOKEN ||
           this.type === ERROR_KEY.UNAUTHORIZED;
  }

  hasSystemError(): boolean {
    return this.type === 'SYSTEM_ERROR';
  }

  isNetworkError(): boolean {
    return this.type === ERROR_KEY.NETWORK_ERROR ||
           this.type === ERROR_KEY.TIMEOUT_ERROR;
  }

  isServerError(): boolean {
    return this.httpStatus >= 500 ||
           this.type === ERROR_KEY.SERVER_ERROR;
  }

  isNotFoundError(): boolean {
    return this.httpStatus === 404 ||
           this.type === ERROR_KEY.NOT_FOUND;
  }

  isBadRequestError(): boolean {
    return this.httpStatus === 400 ||
           this.type === ERROR_KEY.BAD_REQUEST;
  }

  isValidationError(): boolean {
    return this.type === ERROR_KEY.VALIDATION_ERROR;
  }

  isBusinessError(): boolean {
    return this.type === ERROR_KEY.BUSINESS_ERROR;
  }

  getErrorMessage(): string {
    // Auth errors
    if (this.isAuthError()) {
      switch (this.type) {
        case ERROR_KEY.INVALID_TOKEN:
          return 'Phiên đăng nhập đã hết hạn';
        case ERROR_KEY.NO_TOKEN:
          return 'Vui lòng đăng nhập để tiếp tục';
        case ERROR_KEY.UNAUTHORIZED:
          return 'Bạn không có quyền truy cập tính năng này';
        default:
          return 'Vui lòng đăng nhập lại';
      }
    }

    // Network errors
    if (this.type === ERROR_KEY.NETWORK_ERROR) {
      return 'Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng';
    }

    if (this.type === ERROR_KEY.TIMEOUT_ERROR) {
      return 'Kết nối đến máy chủ quá lâu, vui lòng thử lại sau';
    }

    // Server errors
    if (this.httpStatus >= 500 || this.type === ERROR_KEY.SERVER_ERROR) {
      return 'Máy chủ đang gặp sự cố, vui lòng thử lại sau';
    }

    if (this.httpStatus === 404 || this.type === ERROR_KEY.NOT_FOUND) {
      return 'Không tìm thấy endpoint: ' + this.apiPath;
      // return 'Không tìm thấy tài nguyên yêu cầu';
    }

    if (this.httpStatus === 400 || this.type === ERROR_KEY.BAD_REQUEST) {
      return this.message || 'Yêu cầu không hợp lệ';
    }

    // Validation errors
    if (this.type === ERROR_KEY.VALIDATION_ERROR) {
      return this.message || 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại';
    }

    // Business logic errors
    if (this.type === ERROR_KEY.BUSINESS_ERROR) {
      return this.message || 'Không thể thực hiện thao tác này';
    }

    // System errors
    if (this.hasSystemError()) {
      return this.message || 'Lỗi hệ thống, vui lòng thử lại sau';
    }

    // Default error message
    return this.message || `Lỗi ${this.httpStatus || 'không xác định'}` || 'Đã có lỗi xảy ra';
  }

  toJSON() {
    return {
      type: this.type,
      httpStatus: this.httpStatus,
      message: this.message,
      apiPath: this.apiPath,
      stack: this.stack,
      timestamp: this.timestamp,
    };
  }
}
