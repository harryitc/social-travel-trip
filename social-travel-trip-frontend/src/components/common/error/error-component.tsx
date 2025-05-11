'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { isDevMode } from '@/lib/utils/development-mode.utils';

const ErrorComponent: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full text-center">
        <h1 className="text-8xl font-bold text-gray-500">500</h1>
        <p className="mt-2 text-gray-600">
          Có lỗi xảy ra, vui lòng thử lại hoặc quay lại trang chủ. Nếu vấn đề vẫn tiếp diễn, hãy liên hệ với bộ phận hỗ trợ của chúng tôi.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-1 px-3 rounded mt-4"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;