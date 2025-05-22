import { z } from 'zod';

/**
 * Zod validation schemas for authentication forms
 */

// Login form validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
    .max(50, { message: 'Tên đăng nhập không được vượt quá 50 ký tự' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' }),
});

// Register form validation schema
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
      .max(50, { message: 'Tên đăng nhập không được vượt quá 50 ký tự' }),
    full_name: z
      .string()
      .min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
      .max(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
      .optional(),
    email: z
      .string()
      .email({ message: 'Email không hợp lệ' })
      .optional(),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
      .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// Reset password form validation schema
export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
});

// Confirm reset password form validation schema
export const confirmResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
      .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// Types inferred from schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ConfirmResetPasswordFormValues = z.infer<typeof confirmResetPasswordSchema>;
