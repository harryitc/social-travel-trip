'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CustomAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Additional validations for registration
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Họ tên là bắt buộc';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setAuthError('');
      setAuthSuccess('');

      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (isLogin) {
          // Xử lý đăng nhập
          console.log('Đăng nhập với:', formData.email);

          // Giả lập lưu token vào localStorage
          localStorage.setItem('auth_token', 'fake_token_' + Date.now());
          localStorage.setItem('user_email', formData.email);

          setAuthSuccess('Đăng nhập thành công!');

          // Chuyển hướng sau khi đăng nhập
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          // Xử lý đăng ký
          console.log('Đăng ký với:', formData);
          setAuthSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');

          // Chuyển sang form đăng nhập sau khi đăng ký
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              name: '',
              confirmPassword: ''
            }));
          }, 1500);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setAuthError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setAuthError('');
    setAuthSuccess('');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      // Giả lập API call đăng nhập Google
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Giả lập lưu thông tin người dùng Google
      const googleUser = {
        email: 'user@gmail.com',
        name: 'Google User',
        picture: 'https://lh3.googleusercontent.com/a/default-user'
      };

      localStorage.setItem('auth_token', 'google_token_' + Date.now());
      localStorage.setItem('user_email', googleUser.email);
      localStorage.setItem('user_name', googleUser.name);
      localStorage.setItem('user_picture', googleUser.picture);
      localStorage.setItem('auth_provider', 'google');

      setAuthSuccess('Đăng nhập Google thành công!');

      // Chuyển hướng sau khi đăng nhập
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Google sign in error:', error);
      setAuthError('Không thể đăng nhập bằng Google. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {!isLogin && (
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium">
              Họ tên
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="******"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {!isLogin && (
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
        </Button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline text-sm"
            disabled={isLoading}
          >
            {isLogin
              ? 'Chưa có tài khoản? Đăng ký ngay'
              : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>

        {isLogin && (
          <div className="text-center mt-2">
            <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-primary">
              Quên mật khẩu?
            </Link>
          </div>
        )}

        {authError && (
          <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded">
            {authSuccess}
          </div>
        )}
      </form>

      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="relative flex items-center justify-center my-3 sm:my-4">
          <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
          <div className="bg-white dark:bg-gray-800 px-2 sm:px-4 text-xs sm:text-sm text-gray-500">hoặc</div>
          <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sm"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-xs sm:text-sm">{isLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}</span>
        </Button>
      </div>
    </div>
  );
}
