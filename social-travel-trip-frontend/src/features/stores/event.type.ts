// Định nghĩa kiểu dữ liệu cho từng loại sự kiện (event)
export type EventMap = {
  'post:created': { data?: any };
  'post:liked': { data?: any };
  'post:commented': { data?: any };
  'comment:like': { data?: any };
  'comment:created': { data?: any };
  'user:follow': { data?: any };
  'user:following': { data?: any };

  // Group events
  'group:created': { group: any };
  'group:joined': { group: any };
  'group:updated': { group: any };
  'group:left': { group: any };
  'group:member_added': { group: any; member: any };
  'group:member_removed': { group: any; memberId: string };
  'group:selected': { group: any };

  // Chat events
  'chat:message_sent': { groupId: string; message: any };
  'chat:message_received': { groupId: string; message: any };
  'chat:message_pinned': { groupId: string; messageId: string };
  'chat:message_unpinned': { groupId: string; messageId: string };
  'chat:typing_start': { groupId: string; userId: string };
  'chat:typing_stop': { groupId: string; userId: string };
  'chat:messages_loaded': { groupId: string; messages: any[] };
};

// Các key của EventMap sẽ là các loại sự kiện hợp lệ
export type EventType = keyof EventMap;

