import { create } from 'zustand'
import { EventMap, EventType } from './event.type'
import { TripGroup } from '@/features/trips/models/trip-group.model'

// Kiểu hàm listener với payload tương ứng cho mỗi loại sự kiện
type Listener<K extends EventType> = (payload: EventMap[K]) => void

interface EventStore {
  emit: <K extends EventType>(type: K, payload: EventMap[K]) => void    // Gửi sự kiện
  on: <K extends EventType>(type: K, listener: Listener<K>) => () => void // Lắng nghe sự kiện
  once: <K extends EventType>(type: K, listener: Listener<K>) => void     // Lắng nghe sự kiện một lần duy nhất
}

// Group store để chia sẻ state giữa các component
interface GroupStore {
  groups: TripGroup[]
  selectedGroupId: string
  loading: boolean
  setGroups: (groups: TripGroup[]) => void
  setSelectedGroupId: (id: string) => void
  setLoading: (loading: boolean) => void
  addGroup: (group: TripGroup) => void
  updateGroup: (group: TripGroup) => void
  updateGroupMemberCount: (groupId: string, countChange: number) => void
  removeGroup: (groupId: string) => void
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

// Group store để chia sẻ state giữa các component
export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  selectedGroupId: '',
  loading: false,

  setGroups: (groups) => set({ groups }),
  setSelectedGroupId: (selectedGroupId) => set({ selectedGroupId }),
  setLoading: (loading) => set({ loading }),

  addGroup: (group) => set((state) => {
    // Check if group already exists
    const existingGroupIndex = state.groups.findIndex(g => g.id === group.id);
    if (existingGroupIndex !== -1) {
      // Update existing group
      const updatedGroups = [...state.groups];
      updatedGroups[existingGroupIndex] = group;
      return { groups: updatedGroups };
    } else {
      // Add new group
      return { groups: [group, ...state.groups] };
    }
  }),

  updateGroup: (updatedGroup) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === updatedGroup.id ? updatedGroup : group
    )
  })),

  updateGroupMemberCount: (groupId, countChange) => set((state) => ({
    groups: state.groups.map(group => {
      if (group.id === groupId) {
        const newCount = Math.max(0, group.members.count + countChange);
        console.log(`📊 [Store] Updating member count for group ${group.title}: ${group.members.count} -> ${newCount}`);

        // Create a new TripGroup instance to preserve methods
        const updatedGroup = new TripGroup({
          group_id: group.group_id,
          name: group.name,
          title: group.title,
          description: group.description,
          cover_url: group.cover_url,
          status: group.status,
          json_data: group.json_data,
          created_at: group.createdAt.toISOString(),
          updated_at: group.updatedAt.toISOString(),
          plan_id: group.plan_id,
          join_code: group.join_code,
          join_code_expires_at: group.join_code_expires_at?.toISOString(),
          members: {
            count: newCount,
            max: group.members.max,
            list: group.members.list.map(m => ({
              group_member_id: m.group_member_id,
              group_id: m.group_id,
              user_id: m.user_id,
              nickname: m.nickname,
              role: m.role,
              join_at: m.joinAt.toISOString(),
              username: m.name,
              full_name: (m as any).full_name,
              avatar_url: m.avatar
            }))
          }
        });

        return updatedGroup;
      }
      return group;
    })
  })),

  removeGroup: (groupId) => set((state) => ({
    groups: state.groups.filter(group => group.id !== groupId)
  })),
}))
