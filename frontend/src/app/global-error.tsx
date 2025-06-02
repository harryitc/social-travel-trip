'use client';
import { useEffect } from 'react';
import { Alert, Button } from 'antd';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="bg-white shadow-md rounded-lg p-8 w-full text-center flex flex-col gap-3">
            <div className="text-2xl">Ôi không! Đã có lỗi xảy ra rồi 🥺</div>
            {isDev && <Alert message="Error" description={error.message} type="error" showIcon />}
            <Button
              type="primary"
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Thử lại
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
