'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/features/auth/auth.service';

/**
 * Register page component
 * Redirects to home if already logged in
 */
export default function RegisterPage() {
  const router = useRouter();
  
  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Social Travel Trip
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Đăng ký tài khoản để bắt đầu hành trình của bạn
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
}
