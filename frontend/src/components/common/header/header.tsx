'use client';
import Link from 'next/link';
import SearchBox from './components/search-box';
import CustomImage from '@/components/ui/custom-image';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { environment } from '@/config/environment';
import { useEffect, useRef, useState } from 'react';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import ThemeMode from '../theme-mode/theme-mode';
import { useThemeModeStore } from '../theme-mode/stores/theme-mode.store';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import NavBar from '../navbar';

const UserInfo = dynamic(() => import('@/features/auth/components/user-info'), {
  ssr: false,
});

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const { isDarkMode } = useThemeModeStore();

  // const prevWidth = useRef(window.innerWidth); // Lưu kích thước trước đó

  // useEffect(() => {
  //   const handleResize = () => {
  //     const currentWidth = window.innerWidth;

  //     if (prevWidth.current > 768 && currentWidth <= 768) {
  //       // Chuyển từ desktop -> mobile => Mở Drawer
  //       setOpen(true);
  //     } else if (prevWidth.current <= 768 && currentWidth > 768) {
  //       // Chuyển từ mobile -> desktop => Đóng Drawer
  //       setOpen(false);
  //     }

  //     prevWidth.current = currentWidth; // Cập nhật kích thước trước đó
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);


  return (
    <header>
      <div className="mx-auto flex justify-between items-center gap-3 md:max-w-[1140px] px-4">

        <Link href="/">
          <CustomImage
            src={
              isDarkMode
                ? '/assets/image/logo/truyxi_logo_dark.svg'
                : '/assets/image/logo/truyxi_logo_light.svg'
            }
            alt="logo"
            width={170}
            height={40}
            className="object-cover h-10 w-40"
          />
        </Link>

        <div className="hidden md:flex items-center w-full max-w-sm lg:max-w-md">
          <SearchBox></SearchBox>
        </div>
      </div>
    </header>
  );
}
