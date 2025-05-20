'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { UniversalView360, View360Source } from '@/features/view360';

export default function UniversalView360Demo() {
  // Dữ liệu mẫu cho panorama
  const panoramaSource: View360Source = {
    type: 'panorama',
    scenes: [
      {
        id: 'scene1',
        name: 'Bãi biển',
        image: 'https://cdn.pixabay.com/photo/2014/11/21/03/26/beach-540136_1280.jpg',
        description: 'Bãi biển đẹp với cát trắng',
        hotspots: [
          {
            id: 'scene2',
            name: 'Đến khu rừng',
            position: { yaw: '0', pitch: '0' },
            tooltip: 'Đi đến khu rừng'
          }
        ]
      },
      {
        id: 'scene2',
        name: 'Khu rừng',
        image: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_1280.jpg',
        description: 'Khu rừng nhiệt đới',
        hotspots: [
          {
            id: 'scene1',
            name: 'Quay lại bãi biển',
            position: { yaw: '180', pitch: '0' },
            tooltip: 'Quay lại bãi biển'
          }
        ]
      }
    ]
  };

  // Dữ liệu mẫu cho Google Maps Street View
  const googleMapsSource: View360Source = {
    type: 'google-maps',
    url: 'https://www.google.com/maps/embed?pb=!4v1747330345274!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ09oN2JLblFF!2m2!1d10.05725757562915!2d104.0363948436442!3f252.2606279243012!4f-33.282491262245465!5f0.4000000000000002',
    title: 'Bãi Sao, Phú Quốc',
    description: 'Bãi biển cát trắng nổi tiếng ở Phú Quốc'
  };

  // State để lưu nguồn dữ liệu hiện tại
  const [currentSource, setCurrentSource] = useState<View360Source>(panoramaSource);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Universal View 360°"
        description="Xem hình ảnh 360° từ nhiều nguồn khác nhau"
      />

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="panorama" onValueChange={(value) => {
            if (value === 'panorama') {
              setCurrentSource(panoramaSource);
            } else if (value === 'google-maps') {
              setCurrentSource(googleMapsSource);
            }
          }}>
            <TabsList>
              <TabsTrigger value="panorama">Panorama</TabsTrigger>
              <TabsTrigger value="google-maps">Google Maps Street View</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <UniversalView360
                source={currentSource}
                height="500px"
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
          <div className="prose dark:prose-invert max-w-none">
            <h3>Cách sử dụng UniversalView360</h3>
            <p>Component <code>UniversalView360</code> cho phép hiển thị cả ảnh panorama 360° và Google Maps Street View trong cùng một giao diện thống nhất.</p>

            <h4>Hiển thị ảnh panorama 360°</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`import { UniversalView360 } from '@/features/view360';

// Trong component của bạn
<UniversalView360
  source={{
    type: 'panorama',
    scenes: [
      {
        id: 'scene1',
        name: 'Bãi biển',
        image: '/path/to/beach-panorama.jpg',
        description: 'Bãi biển đẹp với cát trắng',
        hotspots: [
          {
            id: 'scene2',
            name: 'Đến khu rừng',
            position: { yaw: '0', pitch: '0' },
            tooltip: 'Đi đến khu rừng'
          }
        ]
      },
      // Thêm các scene khác...
    ]
  }}
  height="500px"
/>`}
            </pre>

            <h4>Hiển thị Google Maps Street View</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`import { UniversalView360 } from '@/features/view360';

// Trong component của bạn
<UniversalView360
  source={{
    type: 'google-maps',
    url: 'https://maps.app.goo.gl/2HcQS9JHTAsNUZd76',
    title: 'Bãi Sao, Phú Quốc',
    description: 'Bãi biển cát trắng nổi tiếng ở Phú Quốc'
  }}
  height="500px"
/>`}
            </pre>

            <h3>Các thuộc tính của component</h3>
            <ul>
              <li><code>source</code>: Nguồn dữ liệu 360° (panorama hoặc google-maps)</li>
              <li><code>height</code>: Chiều cao của component (mặc định: 400px)</li>
              <li><code>width</code>: Chiều rộng của component (mặc định: 100%)</li>
              <li><code>fullscreenButton</code>: Hiển thị nút toàn màn hình (mặc định: true)</li>
              <li><code>resetButton</code>: Hiển thị nút reset (mặc định: true)</li>
              <li><code>showSceneSelector</code>: Hiển thị bộ chọn cảnh (chỉ áp dụng cho panorama, mặc định: true)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
