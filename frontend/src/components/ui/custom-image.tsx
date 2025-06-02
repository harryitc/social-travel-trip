'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface CustomImageProps extends Omit<ImageProps, 'alt'> {
  /** Ảnh fallback khi src bị lỗi hoặc rỗng */
  fallbackSrc?: string;
  alt?: string;
  /** Hiển thị loading skeleton */
  showSkeleton?: boolean;
}

/**
 * CustomImage: Custom component bọc quanh next/image với fallback.
 * Nếu src bị lỗi hoặc rỗng, sẽ hiển thị fallbackSrc (mặc định là '/assets/image/img/empty-image.png').
 */
export default function CustomImage({
  src,
  fallbackSrc = '/assets/image/img/empty-image.png',
  alt = 'image',
  showSkeleton = false,
  ...props
}: CustomImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isValidSrc = (url?: string | any) => {
    if (typeof url !== 'string' || url.trim() === '') return false;
    try {
      new URL(url); // Kiểm tra xem URL có hợp lệ không
      return true;
    } catch (e) {
      // Nếu là relative path (bắt đầu bằng "/"), cũng hợp lệ
      return url.startsWith('/');
    }
  };

  const initialSrc = isValidSrc(src) ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string | StaticImport>(initialSrc);

  // Khi src thay đổi từ props, cập nhật lại imgSrc
  useEffect(() => {
    setError(false);
    setLoading(true);
    setImgSrc(isValidSrc(src) ? src : fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    setError(true);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      {showSkeleton && loading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
      )}
      <Image
        {...props}
        src={imgSrc!}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${props.className || ''} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        // Các thuộc tính tối ưu khác có thể thêm ở đây
        priority={props.priority}
        placeholder={props.placeholder}
        unoptimized={props.unoptimized || error} // Sử dụng unoptimized khi có lỗi
      />
    </div>
  );
}
