import { useEffect } from 'react';
import { EventMap, EventType } from './event.type';
import { useEventStore } from './event.store';

// Kiểu cho danh sách nhiều sự kiện cần lắng nghe cùng lúc
// Mỗi key là loại sự kiện, value là hàm xử lý tương ứng
type ListenerMap = {
  [K in EventType]?: (payload: EventMap[K]) => void;
};

// Custom hook giúp lắng nghe nhiều sự kiện cùng lúc
// Tự động hủy tất cả khi component unmount
export function useEventListeners(listeners: ListenerMap) {
  const on = useEventStore((state) => state.on);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    Object.entries(listeners).forEach(([type, handler]) => {
      if (handler) {
        const unsub = on(type as EventType, handler as any);
        unsubscribers.push(unsub);
      }
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [on, listeners]);
}
