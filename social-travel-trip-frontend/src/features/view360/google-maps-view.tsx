'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, RotateCcw, MapPin } from 'lucide-react';

interface GoogleMapsViewProps {
  mapUrl: string;
  className?: string;
  height?: string;
  width?: string;
  fullscreenButton?: boolean;
  resetButton?: boolean;
  title?: string;
  description?: string;
}

/**
 * GoogleMapsView - Component để nhúng Google Maps Street View 360 độ
 * 
 * @param mapUrl URL của Google Maps Street View (dạng https://maps.app.goo.gl/XXX hoặc https://goo.gl/maps/XXX)
 * @param className CSS class tùy chỉnh
 * @param height Chiều cao của component (mặc định: 400px)
 * @param width Chiều rộng của component (mặc định: 100%)
 * @param fullscreenButton Hiển thị nút toàn màn hình (mặc định: true)
 * @param resetButton Hiển thị nút reset (mặc định: true)
 * @param title Tiêu đề hiển thị phía trên Street View
 * @param description Mô tả hiển thị phía trên Street View
 */
export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  mapUrl,
  className = '',
  height = '400px',
  width = '100%',
  fullscreenButton = true,
  resetButton = true,
  title,
  description,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Xử lý URL Google Maps để lấy embed URL
  const getEmbedUrl = (url: string): string => {
    // Kiểm tra nếu URL đã là embed URL
    if (url.includes('maps.google.com/maps/embed') || url.includes('www.google.com/maps/embed')) {
      return url;
    }

    // Xử lý URL dạng https://maps.app.goo.gl/XXX hoặc https://goo.gl/maps/XXX
    let embedUrl = '';
    
    try {
      // Nếu là URL rút gọn, thử trích xuất tham số
      if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
        // Đối với URL rút gọn, chúng ta sẽ sử dụng mode=streetview
        embedUrl = `https://www.google.com/maps/embed?pb=!4v!1m3!1m2!1s${encodeURIComponent(url)}!2s!5e0!3m2!1svi!2s!4v1`;
      } 
      // Nếu là URL đầy đủ với tham số
      else if (url.includes('google.com/maps')) {
        // Trích xuất tham số từ URL
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        
        // Nếu có tham số ll (latitude,longitude)
        if (params.has('ll')) {
          const ll = params.get('ll');
          embedUrl = `https://www.google.com/maps/embed?pb=!4v!1m3!1m2!1s!2s${ll}!5e0!3m2!1svi!2s!4v1`;
        }
        // Nếu có tham số q (query/address)
        else if (params.has('q')) {
          const q = params.get('q');
          embedUrl = `https://www.google.com/maps/embed?pb=!4v!1m3!1m2!1s!2s${q}!5e0!3m2!1svi!2s!4v1`;
        }
        // Nếu không có tham số phù hợp, sử dụng URL gốc
        else {
          embedUrl = `https://www.google.com/maps/embed/v1/streetview?key=YOUR_API_KEY&location=${encodeURIComponent(url)}`;
        }
      }
      // Nếu không phải URL Google Maps hợp lệ
      else {
        console.error('URL không hợp lệ:', url);
        embedUrl = url; // Sử dụng URL gốc
      }
    } catch (error) {
      console.error('Lỗi khi xử lý URL:', error);
      embedUrl = url; // Sử dụng URL gốc nếu có lỗi
    }

    return embedUrl;
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

  // Xử lý khi nhấn nút reset
  const handleReset = () => {
    if (iframeRef.current) {
      // Reload iframe để reset view
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
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

  const embedUrl = getEmbedUrl(mapUrl);

  return (
    <Card className={`overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs ${className}`}>
      <CardContent className="p-0">
        <div ref={containerRef} className="relative">
          <div style={{ height, width }}>
            <iframe
              ref={iframeRef}
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Location Info */}
          {(title || description) && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              {title && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium text-sm">{title}</span>
                </div>
              )}

              {description && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                  <span className="text-sm">{description}</span>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {resetButton && (
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={handleReset}
                title="Đặt lại góc nhìn"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {fullscreenButton && (
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsView;
