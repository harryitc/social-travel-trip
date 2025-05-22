# Chức năng Theo dõi (Follow System)

## Tổng quan

Chức năng theo dõi cho phép người dùng kết nối với nhau trong cộng đồng du lịch, theo dõi những người có cùng sở thích và nhận thông báo khi họ đăng bài viết mới.

## Các Component

### 1. FollowButton
Component button để theo dõi/bỏ theo dõi người dùng.

**Props:**
- `userId`: ID của người dùng cần theo dõi
- `username`: Tên đăng nhập
- `fullName`: Tên đầy đủ
- `variant`: Kiểu button (default, outline, ghost)
- `size`: Kích thước button (default, sm, lg, icon)
- `showIcon`: Hiển thị icon hay không
- `className`: CSS class tùy chỉnh
- `onFollowChange`: Callback khi trạng thái follow thay đổi

**Sử dụng:**
```tsx
<FollowButton
  userId="123"
  username="john_doe"
  fullName="John Doe"
  variant="outline"
  size="sm"
  onFollowChange={(isFollowing) => console.log('Follow status:', isFollowing)}
/>
```

### 2. FollowList
Component hiển thị danh sách người đang theo dõi và người theo dõi.

**Features:**
- Tab để chuyển đổi giữa "Đang theo dõi" và "Người theo dõi"
- Hiển thị số lượng trong badge
- Loading states
- Empty states với thông báo thân thiện
- Tích hợp FollowButton cho mỗi người dùng

**Sử dụng:**
```tsx
<FollowList className="w-full" />
```

### 3. FollowPage
Trang đầy đủ cho chức năng theo dõi.

**Features:**
- Header với tiêu đề và mô tả
- Tìm kiếm người dùng
- Thống kê (đang theo dõi, người theo dõi, tăng trưởng)
- Danh sách theo dõi
- Gợi ý người dùng (placeholder)

**Sử dụng:**
```tsx
<FollowPage />
```

## API Services

### userService.followUser(userId)
Theo dõi một người dùng.

### userService.unfollowUser(userId)
Bỏ theo dõi một người dùng.

### userService.checkFollowStatus(userId)
Kiểm tra trạng thái theo dõi hiện tại.

### userService.getFollowing()
Lấy danh sách người đang theo dõi.

### userService.getFollowers()
Lấy danh sách người theo dõi.

## Tích hợp

### Trong PostItem
FollowButton đã được tích hợp vào component PostItem, hiển thị bên cạnh dropdown menu.

### Routing
Trang follow có thể truy cập tại `/follow`.

## UX Features

### Notifications
- Thông báo thành công khi follow/unfollow
- Thông báo lỗi khi có vấn đề với API
- Loading states trong quá trình xử lý

### Visual Feedback
- Button thay đổi màu sắc và icon dựa trên trạng thái
- Loading spinner khi đang xử lý
- Badge hiển thị số lượng

### Error Handling
- Graceful fallback khi API lỗi
- Retry mechanism
- User-friendly error messages

## Cải tiến trong tương lai

1. **Real-time updates**: Sử dụng WebSocket để cập nhật real-time
2. **Gợi ý thông minh**: AI-powered user suggestions
3. **Thống kê chi tiết**: Analytics về follow patterns
4. **Notification system**: Push notifications cho follow events
5. **Privacy settings**: Cho phép người dùng ẩn danh sách follow
6. **Mutual friends**: Hiển thị bạn chung
7. **Follow categories**: Phân loại theo sở thích du lịch

## Testing

Để test chức năng:

1. Truy cập `/follow` để xem trang đầy đủ
2. Trong forum posts, click vào FollowButton để test follow/unfollow
3. Kiểm tra notifications và loading states
4. Test với các user khác nhau

## Dependencies

- `antd`: Cho notifications
- `lucide-react`: Icons
- `@/components/ui/*`: UI components
- `@/features/auth/auth.service`: User authentication
