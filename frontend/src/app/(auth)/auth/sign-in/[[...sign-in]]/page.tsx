'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isLoggedIn } from '@/features/auth/auth.service';

/**
 * Login page component
 * Redirects to home if already logged in
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/';
  
  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.push(redirectUrl);
    }
  }, [router, redirectUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            TravelLog
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Đăng nhập để khám phá và chia sẻ trải nghiệm du lịch của bạn
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
