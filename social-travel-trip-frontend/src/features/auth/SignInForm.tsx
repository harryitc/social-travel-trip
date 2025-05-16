'use client'

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard'); // Hoặc trang bạn muốn
      } else {
        setError('Xác thực chưa hoàn tất');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Lỗi đăng nhập');
    }
  };

  const signInWith = async (provider: 'oauth_google' | 'oauth_github') => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback', // Cần tạo route này
        redirectUrlComplete: '/',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Không thể đăng nhập bằng OAuth');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn} className="w-full bg-blue-600 text-white p-2 rounded">
        Đăng nhập
      </button>

      <div className="text-center text-gray-500">— hoặc —</div>

      <button
        onClick={() => signInWith('oauth_google')}
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Đăng nhập với Google
      </button>
      <button
        onClick={() => signInWith('oauth_github')}
        className="w-full bg-gray-800 text-white p-2 rounded"
      >
        Đăng nhập với GitHub
      </button>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
