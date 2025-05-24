'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { changePasswordSchema, ChangePasswordFormData } from '../schemas/profile.schema';
import { profileService } from '../services/profile.service';
import { notification } from 'antd';

interface ChangePasswordFormProps {
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChangePasswordForm({ userId, onSuccess, onCancel }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setLoading(true);

      const payload = {
        user_id: +userId,
        old_password: data.old_password,
        new_password: data.new_password
      };

      await profileService.changePassword(payload);
      
      notification.success({
        message: 'Thành công',
        description: 'Đổi mật khẩu thành công!'
      });

      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error changing password:', error);
      notification.error({
        message: 'Lỗi',
        description: error.response?.data?.reasons?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Đổi mật khẩu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="old_password">Mật khẩu hiện tại</Label>
            <div className="relative">
              <Input
                id="old_password"
                type={showOldPassword ? 'text' : 'password'}
                {...register('old_password')}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowOldPassword(!showOldPassword)}
                disabled={loading}
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.old_password && (
              <p className="text-sm text-red-500">{errors.old_password.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new_password">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                {...register('new_password')}
                placeholder="Nhập mật khẩu mới"
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.new_password && (
              <p className="text-sm text-red-500">{errors.new_password.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirm_password')}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirm_password && (
              <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !isDirty}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đổi...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
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
