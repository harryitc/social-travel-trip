import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * From nestJS https://docs.nestjs.com/exception-filters
 */

/**
 * BadRequestException
 * Sử dụng khi có lỗi đầu vào hoặc yêu cầu không hợp lệ từ phía client, và lỗi không phải do logic nghiệp vụ.
 */
export class BadRequestException extends HttpException {
  constructor(message?: string, reasonsData?: any) {
    super(message || `BAD REQUEST`, HttpStatus.BAD_REQUEST, reasonsData);
  }
}

/**
 * UnauthorizedException
 * If the request already included Authorization credentials, then the 401 response indicates that authorization has been refused for those credentials.
 * Sử dụng khi client gọi lên sử dụng tài nguyên, nhưng không xác minh được danh tính.
 */
export class UnauthorizedException extends HttpException {
  constructor(message?: string, reasonsData?: any) {
    super(message || `Unauthorized`, HttpStatus.UNAUTHORIZED, reasonsData);
  }
}

/**
 * NotFoundException
 * Khi một tài nguyên cụ thể không được tìm thấy
 * HttpStatus.NOT_FOUND (mã trạng thái HTTP 404) thường được sử dụng khi một yêu cầu được gửi tới máy chủ, nhưng tài nguyên hoặc trang mà người dùng yêu cầu không tồn tại hoặc không thể được tìm thấy trên máy chủ. Dưới đây là một số trường hợp phổ biến sử dụng HttpStatus.NOT_FOUND:
 * 
 * Tài nguyên không tồn tại: Khi người dùng yêu cầu một tài nguyên (như file, hình ảnh, hay một API endpoint) nhưng tài nguyên này không tồn tại trên máy chủ.
 * 
 * Ví dụ: Yêu cầu truy cập một trang web có URL không đúng hoặc trang đã bị xóa.
 * ID hoặc dữ liệu không hợp lệ: Trong các ứng dụng web hoặc API, khi người dùng cung cấp một ID hoặc thông tin tìm kiếm không đúng hoặc không có trong cơ sở dữ liệu.
 * 
 * Ví dụ: Tìm một sản phẩm bằng ID, nhưng ID đó không có trong danh sách sản phẩm.
 * Đường dẫn không hợp lệ: Khi người dùng nhập sai URL hoặc đường dẫn của một endpoint không được định nghĩa trong ứng dụng.
 * 
 * Khi phát hiện trường hợp này trong mã, bạn có thể trả về mã trạng thái HttpStatus.NOT_FOUND để thông báo cho người dùng rằng không tìm thấy tài nguyên mà họ yêu cầu.
 */
export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message || `Not Found`, HttpStatus.NOT_FOUND);
  }
}

/**
 * ForbiddenException
 * Sử dụng khi client đã được xác thực nhưng không có quyền truy cập tài nguyên hoặc thực hiện hành động.
 */
export class ForbiddenException extends HttpException {
  constructor(message?: string, reasonsData?: any) {
    super(message || `FORBIDDEN`, HttpStatus.FORBIDDEN, reasonsData);
  }
}

// NotAcceptableException

/**
 *RequestTimeoutException
 */
export class RequestTimeoutException extends HttpException {
  constructor(message?: string, reasonsData?: any) {
    super(
      message ||
        `Delayed response after ${+process.env.HTTP_RES_REP_GATEWAY_TIMEOUT / 1000} seconds`,
      HttpStatus.REQUEST_TIMEOUT,
      reasonsData,
    );
  }
}

// ConflictException
// GoneException
// HttpVersionNotSupportedException
// PayloadTooLargeException
// UnsupportedMediaTypeException
// UnprocessableEntityException

/**
 * InternalServerErrorException
 * Sử dụng khi có lỗi logic ở phía server, không thể xác định rõ nguyên nhân.
 */
export class InternalServerErrorException extends HttpException {
  constructor(message?: string, reasonsData?: any) {
    super(
      message || `Internal Server Error`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      reasonsData,
    );
  }
}

// NotImplementedException
// ImATeapotException
// MethodNotAllowedException
// BadGatewayException
// ServiceUnavailableException
// GatewayTimeoutException
// PreconditionFailedException

/**
 * LogicErrorException
 * Sử dụng khi có lỗi logic phía server, đã biết rõ nguyên nhân.
 */
export class LogicErrorException extends HttpException {
  constructor(message?: string, reasonsData?: any) {
    super(
      message || `Logic error`,
      HttpStatus.UNPROCESSABLE_ENTITY, // 422
      reasonsData,
    );
  }
}
