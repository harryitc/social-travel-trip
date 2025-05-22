'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordService, confirmResetPasswordService } from '@/features/auth/auth.service';
import { resetPasswordSchema, confirmResetPasswordSchema } from '@/features/auth/auth.schema';
import { TResetPasswordPayload, TConfirmResetPasswordPayload } from '@/features/auth/config';

/**
 * Reset password form component
 * Handles both initial reset request and password confirmation with token
 */
export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if we're in confirmation mode (with token)
  const token = searchParams.get('token');
  const isConfirmMode = !!token;

  // Initialize form with zod validation for initial reset
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Initialize form with zod validation for confirmation
  const {
    register: registerConfirm,
    handleSubmit: handleSubmitConfirm,
    formState: { errors: errorsConfirm },
  } = useForm<z.infer<typeof confirmResetPasswordSchema>>({
    resolver: zodResolver(confirmResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle initial reset request
  const onSubmitReset = async (data: TResetPasswordPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await resetPasswordService(data);
      setSuccess('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err?.response?.data?.reasons?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password confirmation
  const onSubmitConfirm = async (data: z.infer<typeof confirmResetPasswordSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: TConfirmResetPasswordPayload = {
        token: token as string,
        password: data.password,
      };

      await confirmResetPasswordService(payload);
      setSuccess('Mật khẩu đã được đặt lại thành công.');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/sign-in?reset=success');
      }, 2000);
    } catch (err: any) {
      console.error('Confirm reset password error:', err);
      setError(err?.response?.data?.reasons?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        {isConfirmMode ? 'Đặt lại mật khẩu' : 'Quên mật khẩu'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {isConfirmMode ? (
        // Confirmation form (with token)
        <form onSubmit={handleSubmitConfirm(onSubmitConfirm)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mật khẩu mới
            </label>
            <input
              id="password"
              type="password"
              {...registerConfirm('password')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu mới"
              disabled={isLoading}
            />
            {errorsConfirm.password && (
              <p className="mt-1 text-sm text-red-600">{errorsConfirm.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...registerConfirm('confirmPassword')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập lại mật khẩu mới"
              disabled={isLoading}
            />
            {errorsConfirm.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errorsConfirm.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </div>
        </form>
      ) : (
        // Initial reset form
        <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...registerReset('email')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập địa chỉ email"
              disabled={isLoading}
            />
            {errorsReset.email && (
              <p className="mt-1 text-sm text-red-600">{errorsReset.email.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu đặt lại mật khẩu'}
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/auth/sign-in"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
