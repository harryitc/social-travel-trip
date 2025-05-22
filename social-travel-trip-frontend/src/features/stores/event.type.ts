// Định nghĩa kiểu dữ liệu cho từng loại sự kiện (event)
export type EventMap = {
  'post:created': { data?: any };
  'post:liked': { data?: any };
  'post:commented': { data?: any };
  'comment:like': { data?: any };
  'comment:created': { data?: any };
  'user:follow': { data?: any };
  'user:following': { data?: any };
};

// Các key của EventMap sẽ là các loại sự kiện hợp lệ
export type EventType = keyof EventMap;

