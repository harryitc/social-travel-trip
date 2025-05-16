'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface CustomImageProps extends Omit<ImageProps, 'alt'> {
  /** Ảnh fallback khi src bị lỗi hoặc rỗng */
  fallbackSrc?: string;
  alt?: string;
}

/**
 * CustomImage: Custom component bọc quanh next/image với fallback.
 * Nếu src bị lỗi hoặc rỗng, sẽ hiển thị fallbackSrc (mặc định là '/fallback.png').
 */
export default function CustomImage({
  src,
  fallbackSrc = '/assets/image/img/empty-image.png',
  alt = 'image',
  ...props
}: CustomImageProps) {
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
    setImgSrc(isValidSrc(src) ? src : fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc!}
      alt={alt}
      onError={handleError}
      // Các thuộc tính tối ưu khác có thể thêm ở đây, ví dụ:
      priority={props.priority}
      placeholder={props.placeholder}
    />
  );
}
