'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // console.error('Page not found');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full text-center">
        <h1 className="text-8xl font-bold text-gray-500">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Trang không tồn tại</h2>
        <p className="mt-2 text-gray-600">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-1 px-3 rounded mt-4"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
