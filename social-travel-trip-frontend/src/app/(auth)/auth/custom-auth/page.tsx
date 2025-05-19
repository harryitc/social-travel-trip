'use client';

import CustomAuthForm from '@/features/auth/CustomAuthForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CustomAuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại trang chủ
          </Link>
          
          <Link 
            href="/auth/sign-in" 
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Đăng nhập với Clerk
          </Link>
        </div>
        
        <CustomAuthForm />
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Bằng việc đăng nhập hoặc đăng ký, bạn đồng ý với{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </Link>{' '}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}
