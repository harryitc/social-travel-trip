# Hướng dẫn xử lý lỗi API

## Tổng quan

Hệ thống xử lý lỗi API đã được cải thiện để tự động xử lý các lỗi phổ biến, đặc biệt là lỗi authentication (401/403) sẽ tự động logout và chuyển hướng về trang đăng nhập.

## Các tính năng chính

### 1. HTTP Interceptor tự động
- **Tự động thêm token** vào header của mọi request
- **Tự động xử lý lỗi 401/403**: logout và chuyển hướng về trang đăng nhập
- **Hiển thị thông báo lỗi** cho network, server, 404 errors
- **Chuyển đổi lỗi** thành `ApiErrorModel` để xử lý thống nhất

### 2. ApiErrorService
- **withErrorHandling**: Wrap function để xử lý lỗi tự động
- **handlePromise**: Xử lý lỗi cho Promise có sẵn
- **handleError**: Xử lý lỗi thủ công với tùy chỉnh chi tiết

### 3. useApiError Hook
- **Tích hợp với React**: Sử dụng trong component
- **Router integration**: Chuyển hướng với Next.js router
- **Component-level error handling**: Xử lý lỗi cụ thể cho component

## Cách sử dụng

### Cách 1: Tự động (Khuyến nghị cho hầu hết trường hợp)

```typescript
// HTTP interceptor sẽ tự động xử lý tất cả
export const userService = {
  async getProfile() {
    // Không cần try-catch, interceptor sẽ xử lý
    const response = await Http.get('/api/user/profile');
    return response;
  }
};
```

**Lợi ích:**
- Không cần code thêm
- Tự động logout khi hết phiên
- Hiển thị thông báo lỗi phù hợp

### Cách 2: Sử dụng ApiErrorService.withErrorHandling

```typescript
import ApiErrorService from '@/lib/api-error-service';

export const postService = {
  // Xử lý lỗi với tùy chọn mặc định
  createPost: ApiErrorService.withErrorHandling(
    async (postData: any) => {
      const response = await Http.post('/api/posts', postData);
      return response;
    },
    {
      showNotification: true,
      onSuccess: (result) => {
        console.log('Post created:', result.id);
      }
    }
  ),

  // Xử lý lỗi tùy chỉnh
  updatePost: ApiErrorService.withErrorHandling(
    async (postId: string, postData: any) => {
      const response = await Http.put(`/api/posts/${postId}`, postData);
      return response;
    },
    {
      showNotification: false, // Không hiển thị thông báo tự động
      customValidationHandler: () => {
        // Xử lý lỗi validation tùy chỉnh
        showCustomValidationModal();
      },
      customAuthHandler: () => {
        // Xử lý lỗi auth tùy chỉnh (không logout tự động)
        showLoginModal();
      }
    }
  )
};
```

### Cách 3: Sử dụng trong React Component

```typescript
import { useApiError } from '@/lib/hooks/use-api-error';

const MyComponent = () => {
  const { handleError, withErrorHandling } = useApiError();

  // Xử lý lỗi thủ công
  const handleSubmit = async (data: any) => {
    try {
      const response = await Http.post('/api/submit', data);
      // Xử lý thành công
    } catch (error: any) {
      handleError(error, {
        showNotification: true,
        onValidationError: () => {
          // Xử lý lỗi validation trong component
          setFormErrors(error.details);
        }
      });
    }
  };

  // Hoặc sử dụng withErrorHandling
  const handleDelete = withErrorHandling(
    async (id: string) => {
      await Http.delete(`/api/items/${id}`);
      // Refresh data
      refetch();
    },
    {
      showNotification: true,
      onSuccess: () => {
        showSuccessMessage('Deleted successfully');
      }
    }
  );

  return (
    // Component JSX
  );
};
```

## Các loại lỗi được xử lý

### 1. Lỗi Authentication (401/403)
- **Tự động logout** và xóa token
- **Chuyển hướng** về trang đăng nhập
- **Lưu đường dẫn hiện tại** để redirect sau khi đăng nhập
- **Hiển thị thông báo** "Phiên đăng nhập đã hết hạn"

### 2. Lỗi Network
- **Không có kết nối internet**
- **Timeout**
- **Server không phản hồi**
- Hiển thị thông báo: "Không thể kết nối đến máy chủ"

### 3. Lỗi Server (5xx)
- **Lỗi máy chủ nội bộ**
- **Service unavailable**
- Hiển thị thông báo: "Máy chủ đang gặp sự cố"

### 4. Lỗi Validation (400)
- **Dữ liệu không hợp lệ**
- **Missing required fields**
- Có thể xử lý tùy chỉnh trong component

### 5. Lỗi Not Found (404)
- **Endpoint không tồn tại**
- **Resource không tìm thấy**
- Hiển thị thông báo: "Không tìm thấy tài nguyên"

## Tùy chỉnh xử lý lỗi

### Tùy chọn cơ bản

```typescript
{
  showNotification: boolean;     // Hiển thị thông báo lỗi
  returnError: boolean;          // Trả về null thay vì throw
  onSuccess: (result) => void;   // Callback khi thành công
  onError: (error) => void;      // Callback khi có lỗi
}
```

### Tùy chỉnh handler cho từng loại lỗi

```typescript
{
  customAuthHandler: () => void;        // Xử lý lỗi auth tùy chỉnh
  customNetworkHandler: () => void;     // Xử lý lỗi network tùy chỉnh
  customServerHandler: () => void;      // Xử lý lỗi server tùy chỉnh
  customValidationHandler: () => void;  // Xử lý lỗi validation tùy chỉnh
}
```

## Best Practices

### 1. Sử dụng HTTP Interceptor cho hầu hết trường hợp
- Đơn giản, không cần code thêm
- Xử lý nhất quán trên toàn ứng dụng

### 2. Sử dụng withErrorHandling khi cần tùy chỉnh
- Xử lý validation errors cụ thể
- Custom success callbacks
- Không muốn hiển thị notification mặc định

### 3. Sử dụng useApiError trong React components
- Cần xử lý lỗi cụ thể cho UI
- Cập nhật state component khi có lỗi
- Tích hợp với form validation

### 4. Tránh try-catch không cần thiết
- HTTP interceptor đã xử lý hầu hết lỗi
- Chỉ dùng try-catch khi cần logic đặc biệt

## Migration từ code cũ

### Trước:
```typescript
async createPost(data: any) {
  try {
    const response = await Http.post('/api/posts', data);
    return response;
  } catch (error) {
    console.error('Error:', error);
    if (error.status === 401) {
      // Logout manually
      logout();
      router.push('/login');
    } else {
      // Show error notification
      notification.error({
        message: 'Error',
        description: error.message
      });
    }
    throw error;
  }
}
```

### Sau:
```typescript
// Cách 1: Đơn giản nhất
async createPost(data: any) {
  // HTTP interceptor tự động xử lý tất cả
  const response = await Http.post('/api/posts', data);
  return response;
}

// Cách 2: Với custom handling
createPost: ApiErrorService.withErrorHandling(
  async (data: any) => {
    const response = await Http.post('/api/posts', data);
    return response;
  },
  {
    onSuccess: (result) => {
      console.log('Post created:', result.id);
    }
  }
)
```

## Debugging

### Development mode
- Tất cả lỗi được log chi tiết trong console
- Hiển thị stack trace và API path
- Error details trong network tab

### Production mode
- Chỉ log lỗi cần thiết
- Thông báo lỗi user-friendly
- Không expose sensitive information
