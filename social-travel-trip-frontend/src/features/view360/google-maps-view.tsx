'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, MapPin, RotateCcw } from 'lucide-react';

interface GoogleMapsViewProps {
  mapUrl: string;
  className?: string;
  height?: string;
  width?: string;
  fullscreenButton?: boolean;
  reloadButton?: boolean;
  title?: string;
  showInfoCard?: boolean;
}

/**
 * GoogleMapsView - Component để nhúng Google Maps Street View 360 độ (đã đơn giản hóa)
 *
 * @param mapUrl URL của Google Maps Street View (dạng https://maps.app.goo.gl/XXX hoặc https://goo.gl/maps/XXX)
 * @param className CSS class tùy chỉnh
 * @param height Chiều cao của component (mặc định: 400px)
 * @param width Chiều rộng của component (mặc định: 100%)
 * @param fullscreenButton Hiển thị nút toàn màn hình (mặc định: true)
 * @param reloadButton Hiển thị nút tải lại (mặc định: true)
 * @param title Tiêu đề hiển thị phía trên Street View
 * @param showInfoCard Hiển thị thẻ thông tin địa điểm (mặc định: true)
 */
export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  mapUrl,
  className = '',
  height = '400px',
  width = '100%',
  fullscreenButton = true,
  reloadButton = true,
  title,
  showInfoCard = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Xử lý URL Google Maps để lấy embed URL
  const getEmbedUrl = (url: string): string => {
    try {
      // Nếu URL đã là embed URL, sử dụng trực tiếp
      if (url.includes('google.com/maps/embed')) {
        return url;
      }

      // Nếu không phải embed URL, sử dụng URL gốc (vì data đã có sẵn embed URL)
      return url;
    } catch (error) {
      console.error('Lỗi khi xử lý URL:', error);
      return url;
    }
  };

  // Xử lý khi nhấn nút fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Xử lý khi nhấn nút reload
  const handleReload = () => {
    if (iframeRef.current) {
      // Lưu lại URL hiện tại
      const currentSrc = iframeRef.current.src;
      // Đặt src thành empty string để buộc iframe reload
      iframeRef.current.src = '';
      // Đặt lại src sau một khoảng thời gian ngắn
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };



  // Theo dõi sự kiện fullscreenchange
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Không cố gắng truy cập vào contentDocument của iframe để tránh lỗi CORS
  useEffect(() => {
    if (iframeRef.current) {
      try {
        // Chỉ đặt sự kiện onload để biết khi iframe đã tải xong
        iframeRef.current.onload = () => {
          console.log('Iframe đã tải xong');
          // Không cố gắng truy cập vào contentDocument hoặc contentWindow
        };
      } catch (error) {
        console.error('Lỗi khi xử lý iframe:', error);
      }
    }
  }, [iframeRef.current]);

  const embedUrl = getEmbedUrl(mapUrl);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`} style={{ height, width }}>
      <div ref={containerRef} className="relative w-full h-full">
        {/* Google Maps Iframe */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          className="google-maps-iframe rounded-xl"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-forms"
        ></iframe>

        {/* Enhanced Location Info */}
        {/* {title && showInfoCard && (
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 flex items-center gap-2">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{title}</span>
            </div>
          </div>
        )} */}

        {/* Enhanced Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-30">
          {reloadButton && (
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-purple-200/50 dark:border-purple-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/50 shadow-lg transition-all duration-200"
              onClick={handleReload}
              title="Tải lại Street View"
            >
              <RotateCcw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </Button>
          )}

          {fullscreenButton && (
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-purple-200/50 dark:border-purple-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/50 shadow-lg transition-all duration-200"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              ) : (
                <Maximize className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsView;
