// Định nghĩa kiểu dữ liệu cho từng loại sự kiện (event)
export type EventMap = {
  'post:created': { id: number; content: string }; // Khi một bài viết mới được tạo
  'post:deleted': { id: number }; // Khi một bài viết bị xoá
  'user:login': { userId: string; token: string }; // Khi người dùng đăng nhập
  'notification:new': { message: string; time: string }; // Khi có thông báo mới
};

// Các key của EventMap sẽ là các loại sự kiện hợp lệ
export type EventType = keyof EventMap;

