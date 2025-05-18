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

  // Xử lý URL Google Maps để lấy embed URL và ẩn UI
  const getEmbedUrl = (url: string): string => {
    // Kiểm tra nếu URL đã là embed URL
    if (url.includes('maps.google.com/maps/embed') || url.includes('www.google.com/maps/embed')) {
      // Thêm tham số để ẩn UI
      if (!url.includes('!3m2!1sen!2s!4v')) {
        // Thêm tham số để ẩn UI
        const modifiedUrl = url.replace(/!4v\d+!/, '!4v1!3m2!1sen!2s!4v!');
        // Thêm tham số để ẩn nút zoom và cho phép truy cập từ localhost
        return modifiedUrl + '&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200';
      }
      // Thêm tham số để ẩn nút zoom và cho phép truy cập từ localhost
      return url + '&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200';
    }

    // Xử lý URL dạng https://maps.app.goo.gl/XXX hoặc https://goo.gl/maps/XXX
    let embedUrl = '';

    try {
      // Nếu URL chứa tham số pb (đây là URL embed đã được định dạng)
      if (url.includes('pb=')) {
        // Thêm tham số để ẩn UI
        if (!url.includes('!3m2!1sen!2s!4v')) {
          const modifiedUrl = url.replace(/!4v\d+!/, '!4v1!3m2!1sen!2s!4v!');
          // Thêm tham số để ẩn nút zoom và cho phép truy cập từ localhost
          return modifiedUrl + '&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200';
        }
        // Thêm tham số để ẩn nút zoom và cho phép truy cập từ localhost
        return url + '&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200';
      }

      // Nếu là URL rút gọn, thử trích xuất tham số
      if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
        // Đối với URL rút gọn, chúng ta sẽ sử dụng mode=streetview và thêm tham số để ẩn UI
        embedUrl = `https://www.google.com/maps/embed?pb=!4v1!1m3!1m2!1s${encodeURIComponent(url)}!2s!3m2!1sen!2s!4v!5e0!3m2!1svi!2s!4v1&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200`;
      }
      // Nếu là URL đầy đủ với tham số
      else if (url.includes('google.com/maps')) {
        // Trích xuất tham số từ URL
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);

        // Nếu có tham số ll (latitude,longitude)
        if (params.has('ll')) {
          const ll = params.get('ll');
          embedUrl = `https://www.google.com/maps/embed?pb=!4v1!1m3!1m2!1s!2s${ll}!3m2!1sen!2s!4v!5e0!3m2!1svi!2s!4v1&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200`;
        }
        // Nếu có tham số q (query/address)
        else if (params.has('q')) {
          const q = params.get('q');
          embedUrl = `https://www.google.com/maps/embed?pb=!4v1!1m3!1m2!1s!2s${q}!3m2!1sen!2s!4v!5e0!3m2!1svi!2s!4v1&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200`;
        }
        // Nếu không có tham số phù hợp, sử dụng URL gốc
        else {
          embedUrl = `https://www.google.com/maps/embed/v1/streetview?key=YOUR_API_KEY&location=${encodeURIComponent(url)}&showui=false&disableDefaultUI=1&scrollwheel=0&zoomControl=0&origin=localhost:4200`;
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
    <Card className={`overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs ${className}`}>
      <CardContent className="p-0">
        <div ref={containerRef} className="relative">
          <div style={{ height, width }}>
            <div className="google-maps-iframe-container">
              <iframe
                ref={iframeRef}
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="google-maps-iframe"
                allow="fullscreen"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-forms"
              ></iframe>
            </div>
          </div>

          {/* Location Info - Simplified */}
          {title && showInfoCard && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                <span className="font-medium text-sm">{title}</span>
              </div>
            </div>
          )}

          {/* Controls - Reload and Fullscreen */}
          <div className="absolute bottom-6 right-16 flex gap-2">
            {reloadButton && (
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={handleReload}
                title="Tải lại ảnh"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {/* {fullscreenButton && (
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
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsView;
