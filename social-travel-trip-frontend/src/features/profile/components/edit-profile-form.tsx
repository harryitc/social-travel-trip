'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { Loader2, Save } from 'lucide-react';
import { updateProfileSchema, UpdateProfileFormData } from '../schemas/profile.schema';
import { UserProfile } from '../models/profile.model';
import { profileService } from '../services/profile.service';
import { notification } from 'antd';
import { setUserInfo } from '@/features/auth/auth.service';

interface EditProfileFormProps {
  user: UserProfile;
  onSuccess?: (updatedUser: UserProfile) => void;
  onCancel?: () => void;
}

export function EditProfileForm({ user, onSuccess, onCancel }: EditProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: user.full_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      date_of_birth: user.date_of_birth ?
        (user.date_of_birth instanceof Date ?
          user.date_of_birth.toISOString().split('T')[0] :
          String(user.date_of_birth).split('T')[0]
        ) : '',
      gender: user.gender === null ? undefined : user.gender,
      address: user.address || '',
      avatar_url: user.avatar_url || ''
    }
  });



  const watchGender = watch('gender');

  const onSubmit = async (data: UpdateProfileFormData) => {


    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        user_id: +user.user_id,
        ...data,
        avatar_url: avatarUrl || undefined
      };

      // Clean up payload
      Object.keys(payload).forEach(key => {
        const value = payload[key as keyof typeof payload];
        if (value === '' || value === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      // Ensure user_id is a number
      if (payload.user_id) {
        payload.user_id = Number(payload.user_id);
      }

      // Ensure gender is boolean or null, not string
      if (payload.gender !== undefined && payload.gender !== null) {
        payload.gender = Boolean(payload.gender);
      }

      const updatedUser = await profileService.updateProfile(payload);
      const userProfileModel = new UserProfile(updatedUser);

      // Update user info in storage
      setUserInfo(userProfileModel.toStorageFormat());

      notification.success({
        message: 'Thành công',
        description: 'Cập nhật thông tin cá nhân thành công!'
      });

      onSuccess?.(userProfileModel);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Lỗi',
        description: error.response?.data?.reasons?.message || error.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (url: string | null) => {
    setAvatarUrl(url || '');
    setValue('avatar_url', url || '', { shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <AvatarUpload
              value={avatarUrl}
              onChange={handleAvatarChange}
              name={user.displayName}
              size="xl"
              disabled={loading}
            />
            <p className="text-sm text-gray-500">Nhấp vào avatar để thay đổi ảnh đại diện</p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Nhập họ và tên"
              disabled={loading}
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Nhập địa chỉ email"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number">Số điện thoại</Label>
            <Input
              id="phone_number"
              {...register('phone_number')}
              placeholder="Nhập số điện thoại"
              disabled={loading}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Ngày sinh</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
              disabled={loading}
            />
            {errors.date_of_birth && (
              <p className="text-sm text-red-500">{errors.date_of_birth.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Giới tính</Label>
            <Select
              value={
                watchGender === undefined || watchGender === null
                  ? 'undefined'
                  : watchGender.toString()
              }
              onValueChange={(value) => {
                if (value === 'undefined') {
                  setValue('gender', undefined, { shouldDirty: true });
                } else {
                  setValue('gender', value === 'true', { shouldDirty: true });
                }
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undefined">Chưa xác định</SelectItem>
                <SelectItem value="true">Nam</SelectItem>
                <SelectItem value="false">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Nhập địa chỉ"
              disabled={loading}
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
