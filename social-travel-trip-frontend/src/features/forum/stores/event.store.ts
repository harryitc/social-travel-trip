import { create } from 'zustand'
import { EventMap, EventType } from './event.type'

// Kiểu hàm listener với payload tương ứng cho mỗi loại sự kiện
type Listener<K extends EventType> = (payload: EventMap[K]) => void

interface EventStore {
  emit: <K extends EventType>(type: K, payload: EventMap[K]) => void    // Gửi sự kiện
  on: <K extends EventType>(type: K, listener: Listener<K>) => () => void // Lắng nghe sự kiện
  once: <K extends EventType>(type: K, listener: Listener<K>) => void     // Lắng nghe sự kiện một lần duy nhất
}

export const useEventStore = create<EventStore>(() => {
  // Bản đồ lưu các listener đang lắng nghe theo từng loại sự kiện
  const listenersMap = new Map<EventType, Set<Listener<any>>>()

  return {
    // Gửi sự kiện đến các listener đang lắng nghe
    emit: (type, payload) => {
      const listeners = listenersMap.get(type)
      if (listeners) {
        listeners.forEach(listener => listener(payload))
      }
    },

    // Đăng ký một listener và trả về hàm unsubscribe
    on: (type, listener) => {
      const listeners = listenersMap.get(type) || new Set()
      listeners.add(listener)
      listenersMap.set(type, listeners)

      return () => {
        const current = listenersMap.get(type)
        current?.delete(listener)
      }
    },

    // Lắng nghe một sự kiện chỉ một lần duy nhất
    once: (type, listener) => {
      const wrapped = (payload: any) => {
        listener(payload)
        const listeners = listenersMap.get(type)
        listeners?.delete(wrapped)
      }

      const listeners = listenersMap.get(type) || new Set()
      listeners.add(wrapped)
      listenersMap.set(type, listeners)
    },
  }
})
