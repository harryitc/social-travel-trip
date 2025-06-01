# Trip Chat Layout Components

Cấu trúc layout 3 cột cho trang chat nhóm chuyến đi đã được tách thành 3 component độc lập và logic được đưa trực tiếp vào page:

## Cấu trúc Components

### 1. GroupListColumn (Cột trái)
**File:** `group-list-column.tsx`

**Chức năng:**
- Load danh sách nhóm từ API khi component mount
- Tự động chọn nhóm đầu tiên nếu không có nhóm nào được chọn
- Tự động chọn nhóm theo `initialTripId` nếu có
- Lắng nghe events: `group:created`, `group:joined`, `group:updated`
- Hiển thị skeleton loading khi đang load

**Props:**
- `selectedGroupId?: string` - ID của nhóm đang được chọn
- `onSelectGroup: (group: TripGroup) => void` - Callback khi chọn nhóm
- `initialTripId?: string` - ID nhóm cần chọn ban đầu

### 2. ChatColumn (Cột giữa)
**File:** `chat-column.tsx`

**Chức năng:**
- Hiển thị TripChat component khi có nhóm được chọn
- Hiển thị empty state khi chưa chọn nhóm
- TripChat tự động load messages khi `tripId` thay đổi

**Props:**
- `selectedGroup: TripGroup | null` - Nhóm đang được chọn
- `onCreateGroup?: () => void` - Callback tạo nhóm mới (optional)
- `onSearchGroup?: () => void` - Callback tìm kiếm nhóm (optional)

### 3. GroupDetailsColumn (Cột phải)
**File:** `group-details-column.tsx`

**Chức năng:**
- Hiển thị GroupChatDetails component khi có nhóm được chọn
- Hiển thị empty state khi chưa chọn nhóm
- Tự động cập nhật thông tin khi nhóm thay đổi

**Props:**
- `selectedGroup: TripGroup | null` - Nhóm đang được chọn

## Pages

**File:** `app/(social-travel-trip-group-chat)/trips/page.tsx`
**File:** `app/(social-travel-trip-group-chat)/trips/[id]/page.tsx`

**Chức năng:**
- Quản lý state `selectedGroup` trực tiếp trong page
- Xử lý URL routing khi chọn nhóm
- Render 3 component cột với props phù hợp
- Hiển thị breadcrumb
- Truyền `initialTripId` trực tiếp vào GroupListColumn (chỉ page [id])

## Flow hoạt động chi tiết

### 🚀 **Khi vào trang:**

**Bước 1: Setup Context**
- Page tạo `ChatLayoutProvider` với `initialTripId` (nếu có)
- Layout nhận `initialTripId` từ context

**Bước 2: Load danh sách nhóm**
- `GroupListColumn` mount và gọi API `getAllGroups()`
- Hiển thị skeleton loading trong khi chờ

**Bước 3: Auto-select nhóm**
- Sau khi load xong danh sách nhóm:
  - Nếu có `initialTripId` → Tìm và chọn nhóm đó
  - Nếu không có `initialTripId` → Chọn nhóm đầu tiên
- Gọi `onSelectGroup(group)` → Trigger layout cập nhật `selectedGroup`

**Bước 4: Load messages + chi tiết nhóm (song song)**
- `ChatColumn` nhận `selectedGroup` → Render `TripChat` → TripChat tự động load messages
- `GroupDetailsColumn` nhận `selectedGroup` → Render `GroupChatDetails`

### 👆 **Khi user click nhóm khác:**

**Bước 1: User interaction**
- User click nhóm trong `GroupListColumn`
- Gọi `onSelectGroup(newGroup)`

**Bước 2: Update state + URL**
- Layout cập nhật `selectedGroup = newGroup`
- Router cập nhật URL `/trips/{newGroupId}`

**Bước 3: Re-render cột giữa + phải**
- `ChatColumn` re-render với nhóm mới → TripChat load messages mới
- `GroupDetailsColumn` re-render với thông tin nhóm mới

### 📡 **Khi có events realtime:**
- `GroupListColumn` lắng nghe events: `group:created`, `group:joined`, `group:updated`
- Cập nhật danh sách và tự động chọn nhóm mới tạo/join

## Cấu trúc file mới

```
app/(social-travel-trip-group-chat)/
├── layout.tsx                    # Logic chính của chat layout
├── trips/
│   ├── page.tsx                 # Trang danh sách (không có initialTripId)
│   └── [id]/page.tsx           # Trang chi tiết (có initialTripId)

features/trips/
├── components/
│   ├── group-list-column.tsx    # Cột trái
│   ├── chat-column.tsx         # Cột giữa
│   ├── group-details-column.tsx # Cột phải
│   └── README.md
└── context/
    └── chat-layout.context.tsx  # Context chia sẻ initialTripId
```

## Lợi ích của cấu trúc mới

- **Logic tập trung:** Toàn bộ logic chat được quản lý ở layout
- **Tách biệt trách nhiệm:** Mỗi component chỉ quản lý logic riêng của mình
- **Dễ maintain:** Code rõ ràng, dễ debug và sửa lỗi
- **Reusable:** Có thể tái sử dụng các component ở nơi khác
- **Performance:** Chỉ re-render component cần thiết khi state thay đổi
- **Testing:** Dễ dàng test từng component riêng biệt
- **Clean pages:** Pages chỉ cần setup context, logic ở layout
