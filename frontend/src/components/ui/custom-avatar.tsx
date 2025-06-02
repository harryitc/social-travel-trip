'use client';
import { Avatar, AvatarProps } from 'antd';
import { useState } from 'react';

type TProps = AvatarProps & {
  fallback?: AvatarProps['src'];
};
const CustomAvatar = (props: TProps) => {
  const defaultFallback = '/assets/image/img/empty-image.png';
  const { src, shape, icon, fallback = defaultFallback, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    // Optionally set a fallback image URL
    setImgSrc(defaultFallback);
    // Return false to prevent default fallback behavior
    return false;
  };

  return (
    <Avatar icon={icon} src={imgSrc || fallback} shape={shape} onError={handleError} {...rest} />
  );
};

export default CustomAvatar;
