# Quản lý thành viên nhóm - Hướng dẫn sử dụng

## Tổng quan

Chức năng quản lý thành viên nhóm bao gồm:
1. **Mời thành viên vào nhóm** với autocomplete search
2. **Xem danh sách tất cả thành viên** nhóm hiện tại

## Các component chính

### 1. UserAutocomplete Component
- **Đường dẫn**: `src/features/trips/components/user-autocomplete.tsx`
- **Chức năng**: Tìm kiếm người dùng với autocomplete
- **Tính năng**:
  - Debounced search (300ms)
  - Keyboard navigation (Arrow keys, Enter, Escape)
  - Hiển thị avatar và thông tin user
  - Tự động phát hiện email vs username

### 2. InviteMemberDialog Component
- **Đường dẫn**: `src/features/trips/components/invite-member-dialog.tsx`
- **Chức năng**: Dialog mời thành viên vào nhóm
- **Tính năng**:
  - Autocomplete search cho username/email
  - Chọn vai trò (member/moderator)
  - Đặt biệt danh tùy chọn
  - Tự động fill biệt danh từ tên đầy đủ

### 3. MemberListDialog Component
- **Đường dẫn**: `src/features/trips/member-list-dialog.tsx`
- **Chức năng**: Hiển thị danh sách thành viên nhóm
- **Tính năng**:
  - Load danh sách từ API
  - Search trong danh sách
  - Hiển thị vai trò (Admin/Moderator/Member)
  - Nút mời thêm thành viên

### 4. UserSearchService
- **Đường dẫn**: `src/features/trips/services/user-search.service.ts`
- **Chức năng**: Service tìm kiếm người dùng
- **API endpoints**:
  - `searchUsers()`: Tìm kiếm với pagination
  - `searchUsersAutocomplete()`: Tìm kiếm tối ưu cho autocomplete
  - `getUserByUsernameOrEmail()`: Tìm user cụ thể

## Backend APIs

### 1. Search Users API
- **Endpoint**: `POST /user/search`
- **Tính năng mới**:
  - Tham số `autocomplete: boolean` để tối ưu performance
  - Sắp xếp kết quả theo độ chính xác
  - Tìm kiếm cả username và tên đầy đủ (có dấu và không dấu)

### 2. Group Members API
- **Endpoint**: `POST /group/get-members`
- **Trả về**: Danh sách thành viên với thông tin user đầy đủ

### 3. Invite Member API
- **Endpoint**: `POST /group/invite-member`
- **Tham số**:
  - `group_id`: ID nhóm
  - `username_or_email`: Username hoặc email người được mời
  - `role`: Vai trò (member/moderator)
  - `nickname`: Biệt danh (tùy chọn)

## Cách sử dụng

### 1. Mời thành viên
1. Trong GroupChatDetails, click nút "Mời" hoặc "Mời thêm thành viên"
2. Dialog InviteMemberDialog sẽ mở
3. Nhập username hoặc email (autocomplete sẽ gợi ý)
4. Chọn vai trò và đặt biệt danh (tùy chọn)
5. Click "Gửi lời mời"

### 2. Xem danh sách thành viên
1. Trong GroupChatDetails, click "Xem tất cả" hoặc avatar thành viên
2. Dialog MemberListDialog sẽ mở
3. Có thể search trong danh sách
4. Click "Mời thêm thành viên" để mở dialog mời

## Tính năng nổi bật

### Autocomplete Search
- Tìm kiếm real-time với debounce
- Hỗ trợ tìm kiếm tiếng Việt có dấu và không dấu
- Hiển thị avatar và thông tin user
- Navigation bằng phím

### User Experience
- Loading states và error handling
- Notifications thành công/lỗi
- Responsive design
- Dark mode support

### Performance
- Debounced search để giảm API calls
- Autocomplete mode với ít fields hơn
- Lazy loading danh sách thành viên

## Cấu trúc dữ liệu

### UserSearchResult
```typescript
interface UserSearchResult {
  user_id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
}
```

### GroupMember
```typescript
interface GroupMember {
  group_member_id: number;
  group_id: number;
  user_id: number;
  nickname?: string;
  role: string;
  join_at: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}
```

## Lưu ý kỹ thuật

1. **Debounce**: Search được debounce 300ms để tối ưu performance
2. **Error Handling**: Tất cả API calls đều có error handling và notifications
3. **Type Safety**: Sử dụng TypeScript interfaces cho type safety
4. **Accessibility**: Hỗ trợ keyboard navigation và screen readers
5. **Responsive**: Hoạt động tốt trên mobile và desktop

## Tích hợp

Để sử dụng trong component khác:

```typescript
import { InviteMemberDialog, UserAutocomplete, MemberListDialog } from '@/features/trips/components';
import { userSearchService } from '@/features/trips/services/user-search.service';
```
