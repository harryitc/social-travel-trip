import { z } from 'zod';

/**
 * Zod validation schemas for trip group forms
 */

// Create group form validation schema
export const createGroupSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Tên nhóm là bắt buộc' })
    .min(3, { message: 'Tên nhóm phải có ít nhất 3 ký tự' })
    .max(100, { message: 'Tên nhóm không được vượt quá 100 ký tự' }),
  description: z
    .string()
    .max(255, { message: 'Mô tả không được vượt quá 255 ký tự' })
    .optional(),
  location: z
    .string()
    .min(1, { message: 'Địa điểm là bắt buộc' })
    .max(200, { message: 'Địa điểm không được vượt quá 200 ký tự' }),
  image: z
    .union([
      z.string().url({ message: 'URL ảnh không hợp lệ' }),
      z.instanceof(File, { message: 'File ảnh không hợp lệ' }),
      z.literal(''),
    ])
    .optional(),
  isPrivate: z.boolean(),
});

// Join group form validation schema
export const joinGroupSchema = z.object({
  qrCode: z
    .string()
    .min(1, { message: 'Mã QR hoặc mã tham gia là bắt buộc' })
    .max(50, { message: 'Mã không được vượt quá 50 ký tự' })
    .trim(),
});

// Update group form validation schema
export const updateGroupSchema = z.object({
  group_id: z.number().positive({ message: 'ID nhóm không hợp lệ' }),
  name: z
    .string()
    .min(3, { message: 'Tên nhóm phải có ít nhất 3 ký tự' })
    .max(100, { message: 'Tên nhóm không được vượt quá 100 ký tự' })
    .trim()
    .optional(),
  description: z
    .string()
    .max(255, { message: 'Mô tả không được vượt quá 255 ký tự' })
    .optional(),
  cover_url: z
    .string()
    .url({ message: 'URL ảnh không hợp lệ' })
    .optional(),
  plan_id: z.number().positive().optional(),
  json_data: z.object({
    location: z.string().optional(),
  }).optional(),
});

// Invite member form validation schema
export const inviteMemberSchema = z.object({
  groupId: z.string().min(1, { message: 'ID nhóm là bắt buộc' }),
  usernameOrEmail: z
    .string()
    .min(1, { message: 'Tên đăng nhập hoặc email là bắt buộc' })
    .refine(
      (value) => {
        // Check if it's a valid email or username (at least 3 characters)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || value.length >= 3;
      },
      { message: 'Vui lòng nhập email hợp lệ hoặc tên đăng nhập (ít nhất 3 ký tự)' }
    ),
  role: z.enum(['admin', 'member'], {
    required_error: 'Vui lòng chọn vai trò',
  }).default('member'),
  nickname: z
    .string()
    .max(50, { message: 'Biệt danh không được vượt quá 50 ký tự' })
    .optional(),
});

// Types inferred from schemas
export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;
export type JoinGroupFormValues = z.infer<typeof joinGroupSchema>;
export type UpdateGroupFormValues = z.infer<typeof updateGroupSchema>;
export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
