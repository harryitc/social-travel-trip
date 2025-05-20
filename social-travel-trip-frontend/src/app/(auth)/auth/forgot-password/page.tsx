'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập địa chỉ email của bạn');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            href="/auth/custom-auth" 
            className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
              </p>
              
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Gửi liên kết đặt lại'}
              </Button>
            </form>
          ) : (
            <div className="p-6 space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded">
                <p className="font-medium">Kiểm tra email của bạn</p>
                <p className="text-sm mt-1">
                  Chúng tôi đã gửi một email đến <strong>{email}</strong> với hướng dẫn để đặt lại mật khẩu của bạn.
                </p>
              </div>
              
              <div className="text-center">
                <Link 
                  href="/auth/custom-auth" 
                  className="text-primary hover:underline text-sm"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
