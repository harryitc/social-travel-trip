'use client';

import React from 'react';
import { View360, PanoramaScene } from './view360';
import { GoogleMapsView } from './google-maps-view';

// Định nghĩa các loại nguồn dữ liệu 360 độ
export type View360Source =
  | { type: 'panorama'; scenes: PanoramaScene[]; initialSceneId?: string }
  | { type: 'google-maps'; url: string; title?: string };

interface UniversalView360Props {
  source: View360Source;
  className?: string;
  height?: string;
  width?: string;
  fullscreenButton?: boolean;
  reloadButton?: boolean;
  showSceneSelector?: boolean;
  showInfoCard?: boolean;
}

/**
 * UniversalView360 - Component tổng hợp để hiển thị cả ảnh panorama 360 độ và Google Maps Street View (đã đơn giản hóa)
 *
 * @param source Nguồn dữ liệu 360 độ (panorama hoặc google-maps)
 * @param className CSS class tùy chỉnh
 * @param height Chiều cao của component (mặc định: 400px)
 * @param width Chiều rộng của component (mặc định: 100%)
 * @param fullscreenButton Hiển thị nút toàn màn hình (mặc định: true)
 * @param reloadButton Hiển thị nút tải lại (mặc định: true)
 * @param showSceneSelector Hiển thị bộ chọn cảnh (chỉ áp dụng cho panorama, mặc định: true)
 * @param showInfoCard Hiển thị thẻ thông tin địa điểm (chỉ áp dụng cho google-maps, mặc định: true)
 */
export const UniversalView360: React.FC<UniversalView360Props> = ({
  source,
  className = '',
  height = '400px',
  width = '100%',
  fullscreenButton = true,
  reloadButton = true,
  showSceneSelector = true,
  showInfoCard = true,
}) => {
  // Hiển thị component tương ứng dựa trên loại nguồn dữ liệu
  if (source.type === 'panorama') {
    return (
      <View360
        scenes={source.scenes}
        initialSceneId={source.initialSceneId}
        className={className}
        height={height}
        width={width}
        fullscreenButton={fullscreenButton}
        resetButton={true}
        showSceneSelector={showSceneSelector}
      />
    );
  } else if (source.type === 'google-maps') {
    return (
      <GoogleMapsView
        mapUrl={source.url}
        className={className}
        height={height}
        width={width}
        fullscreenButton={fullscreenButton}
        reloadButton={reloadButton}
        title={source.title}
        showInfoCard={showInfoCard}
      />
    );
  }

  // Trường hợp không có nguồn dữ liệu hợp lệ
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ height, width }}>
      <p className="text-muted-foreground">Không có dữ liệu 360° hợp lệ</p>
    </div>
  );
};

export default UniversalView360;
