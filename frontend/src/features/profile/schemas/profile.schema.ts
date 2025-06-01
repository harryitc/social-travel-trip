import { z } from 'zod';

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return val.length >= 2 && val.length <= 100;
    }, 'Họ tên phải có từ 2-100 ký tự'),

  email: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }, 'Email không hợp lệ'),

  phone_number: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return /^[0-9+\-\s()]*$/.test(val) && val.length >= 10 && val.length <= 15;
    }, 'Số điện thoại không hợp lệ (10-15 ký tự)'),

  date_of_birth: z
    .string()
    .optional()
    .refine((date) => {
      if (!date || date === '') return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, 'Tuổi phải từ 13 đến 120'),

  gender: z
    .boolean()
    .optional()
    .nullable(),

  address: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return val.length <= 255;
    }, 'Địa chỉ không được quá 255 ký tự'),

  avatar_url: z
    .string()
    .optional()
});

/**
 * Schema for changing password
 */
export const changePasswordSchema = z.object({
  old_password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu hiện tại'),

  new_password: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu mới không được quá 50 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),

  confirm_password: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu mới')
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirm_password']
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
