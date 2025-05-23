# Group Chat Layout với Parallel Routes

## Cấu trúc mới

Giao diện chat nhóm đã được cấu trúc lại sử dụng **Next.js Parallel Routes** để tạo layout 3 cột cố định với quản lý state thông qua **Zustand events**.

## Cấu trúc thư mục

```
app/(social-travel-trip-group-chat)/
├── layout.tsx                    # Layout chính với 4 parallel routes
├── @groups/                      # Parallel route - Cột trái (danh sách nhóm)
│   ├── page.tsx                 # Trang chính
│   ├── default.tsx              # Fallback
│   └── trips/[id]/page.tsx      # Trang chi tiết với group được chọn
├── @chat/                       # Parallel route - Cột giữa (chat)
│   ├── page.tsx                 # Trang chính
│   ├── default.tsx              # Fallback
│   └── trips/[id]/page.tsx      # Chat cho group cụ thể
├── @details/                    # Parallel route - Cột phải (chi tiết nhóm)
│   ├── page.tsx                 # Trang chính
│   ├── default.tsx              # Fallback
│   └── trips/[id]/page.tsx      # Chi tiết cho group cụ thể
├── @breadcrumb/                 # Parallel route - Breadcrumb
│   ├── page.tsx                 # Breadcrumb chính
│   ├── default.tsx              # Fallback
│   └── trips/[id]/page.tsx      # Breadcrumb cho group cụ thể
└── trips/
    ├── page.tsx                 # Trang danh sách (null - sử dụng parallel routes)
    └── [id]/page.tsx           # Trang chi tiết (null - sử dụng parallel routes)
```

## Luồng hoạt động

### 1. Khởi tạo trang
- User truy cập `/trips` hoặc `/trips/[id]`
- Layout render 4 parallel routes đồng thời:
  - `@groups`: Load danh sách nhóm
  - `@chat`: Hiển thị empty state
  - `@details`: Hiển thị empty state  
  - `@breadcrumb`: Hiển thị breadcrumb

### 2. Auto-select nhóm
- `@groups` component load xong danh sách → Auto-select nhóm (theo URL hoặc nhóm đầu tiên)
- Emit event `group:selected` qua Zustand

### 3. Cập nhật các cột
- `@chat` listen event `group:selected` → Hiển thị TripChat
- `@details` listen event `group:selected` → Hiển thị GroupChatDetails
- `@breadcrumb` listen event `group:selected` → Cập nhật breadcrumb

### 4. Tương tác người dùng
- User click nhóm khác trong `@groups`
- Emit event `group:selected` với nhóm mới
- Tất cả components khác tự động cập nhật

## Events được sử dụng

### Group Events
- `group:selected` - Khi user chọn nhóm
- `group:created` - Khi tạo nhóm mới
- `group:joined` - Khi join nhóm
- `group:updated` - Khi cập nhật thông tin nhóm
- `group:member_added` - Khi thêm thành viên
- `group:member_removed` - Khi xóa thành viên

### Chat Events (đã chuẩn bị)
- `chat:message_sent` - Khi gửi tin nhắn
- `chat:message_received` - Khi nhận tin nhắn
- `chat:message_pinned` - Khi pin tin nhắn
- `chat:typing_start` - Khi bắt đầu typing
- `chat:typing_stop` - Khi dừng typing

## Ưu điểm

1. **Tách biệt logic**: Mỗi cột có logic riêng, không phụ thuộc lẫn nhau
2. **Event-driven**: Sử dụng Zustand events thay vì props drilling
3. **URL-friendly**: Hỗ trợ shareable links với `/trips/[id]`
4. **Parallel loading**: Các cột load độc lập, tối ưu performance
5. **Maintainable**: Dễ bảo trì và mở rộng

## Cách sử dụng

### Truy cập trang
- `/trips` - Trang danh sách, auto-select nhóm đầu tiên
- `/trips/[id]` - Trang chi tiết, auto-select nhóm theo ID

### Emit events
```typescript
import { useEventStore } from '@/features/stores/event.store';

const { emit } = useEventStore();

// Chọn nhóm
emit('group:selected', { group: selectedGroup });

// Tạo nhóm mới
emit('group:created', { group: newGroup });
```

### Listen events
```typescript
import { useEventListeners } from '@/features/stores/useEventListeners';

useEventListeners({
  'group:selected': (data) => {
    console.log('Group selected:', data.group);
    setSelectedGroup(data.group);
  },
  'group:updated': (data) => {
    console.log('Group updated:', data.group);
    // Update logic here
  },
});
```
