# Profile Feature

Tính năng quản lý hồ sơ cá nhân cho ứng dụng TravelLog.

## Cấu trúc thư mục

```
src/features/profile/
├── components/
│   ├── edit-profile-form.tsx      # Form chỉnh sửa thông tin cá nhân
│   ├── change-password-form.tsx   # Form đổi mật khẩu
│   ├── profile-display.tsx        # Hiển thị thông tin profile
│   └── profile-summary.tsx        # Tóm tắt thông tin profile
├── models/
│   └── profile.model.ts           # Model UserProfile
├── schemas/
│   └── profile.schema.ts          # Zod schemas cho validation
├── services/
│   └── profile.service.ts         # API service cho profile
└── index.ts                       # Export tất cả
```

## Tính năng chính

### 1. Xem thông tin hồ sơ
- Hiển thị thông tin chi tiết người dùng
- Tính toán mức độ hoàn thiện hồ sơ
- Hiển thị avatar với fallback
- Thống kê thông tin tài khoản

### 2. Chỉnh sửa thông tin cá nhân
- Form validation với Zod
- Upload và crop avatar
- Cập nhật thông tin cơ bản:
  - Họ tên
  - Email
  - Số điện thoại
  - Ngày sinh
  - Giới tính
  - Địa chỉ

### 3. Đổi mật khẩu
- Xác thực mật khẩu cũ
- Validation mật khẩu mới
- Xác nhận mật khẩu

### 4. Tích hợp API
- GET `/user/details` - Lấy thông tin người dùng hiện tại
- POST `/user/update` - Cập nhật thông tin
- POST `/user/change-password` - Đổi mật khẩu

## Cách sử dụng

### 1. Import components

```tsx
import { 
  ProfileDisplay, 
  EditProfileForm, 
  ChangePasswordForm,
  UserProfile 
} from '@/features/profile';
```

### 2. Sử dụng ProfileDisplay

```tsx
const user = new UserProfile(userData);

<ProfileDisplay
  user={user}
  onEdit={() => setViewMode('edit')}
  onChangePassword={() => setViewMode('change-password')}
/>
```

### 3. Sử dụng EditProfileForm

```tsx
<EditProfileForm
  user={user}
  onSuccess={(updatedUser) => {
    setUser(updatedUser);
    setViewMode('view');
  }}
  onCancel={() => setViewMode('view')}
/>
```

### 4. Sử dụng ChangePasswordForm

```tsx
<ChangePasswordForm
  userId={user.user_id}
  onSuccess={() => {
    setViewMode('view');
    // Show success message
  }}
  onCancel={() => setViewMode('view')}
/>
```

## API Endpoints

### Backend (NestJS)

```typescript
// GET /user/details
// Lấy thông tin người dùng hiện tại
@Get('details')
@UseGuards(JwtAuthGuard)
async getCurrentUserDetails(@Request() req: any) {
  const userId = req['user']?.user_id;
  return this.service.getUserDetails({}, +userId);
}

// POST /user/update  
// Cập nhật thông tin người dùng
@Post('update')
@UseGuards(JwtAuthGuard)
async updateUser(@Body() dto: UpdateUserDTO, @Request() req: any) {
  const userId = req['user']?.user_id;
  return this.service.updateUser(dto, +userId);
}

// POST /user/change-password
// Đổi mật khẩu
@Post('change-password')
@UseGuards(JwtAuthGuard)
async changePassword(@Body() dto: ChangePasswordDTO, @Request() req: any) {
  const userId = req['user']?.user_id;
  return this.service.changePassword(dto, +userId);
}
```

## Validation Schemas

### UpdateProfileSchema
- `full_name`: 2-100 ký tự
- `email`: Email hợp lệ
- `phone_number`: 10-15 số
- `date_of_birth`: Tuổi từ 13-120
- `gender`: boolean hoặc undefined
- `address`: Tối đa 255 ký tự

### ChangePasswordSchema
- `old_password`: Bắt buộc
- `new_password`: 6-50 ký tự, chứa chữ hoa, thường, số
- `confirm_password`: Phải khớp với new_password

## Dependencies

- `react-hook-form`: Form handling
- `@hookform/resolvers/zod`: Zod integration
- `zod`: Schema validation
- `antd`: Notifications
- `lucide-react`: Icons

## Lưu ý

1. **Avatar Upload**: Sử dụng component `AvatarUpload` có sẵn
2. **Error Handling**: Tất cả lỗi đều được hiển thị qua Antd notifications
3. **Loading States**: Tất cả form đều có loading state
4. **Responsive**: Tất cả component đều responsive
5. **Dark Mode**: Hỗ trợ dark mode
6. **TypeScript**: Fully typed với TypeScript

## Troubleshooting

### Lỗi "Cannot read properties of null (reading 'toString')"
- Đã được sửa trong `EditProfileForm` với việc kiểm tra `null` và `undefined` cho `gender`

### Lỗi date format
- Đã được sửa với việc xử lý cả `Date` object và string

### API errors
- Kiểm tra error message path: `error.response?.data?.message || error.message`
