'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GoogleMapsView } from '@/features/view360';

export default function GoogleMapsDemo() {
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed?pb=!4v1747330345274!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ09oN2JLblFF!2m2!1d10.05725757562915!2d104.0363948436442!3f252.2606279243012!4f-33.282491262245465!5f0.4000000000000002');
  const [inputUrl, setInputUrl] = useState('https://www.google.com/maps/embed?pb=!4v1747330345274!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ09oN2JLblFF!2m2!1d10.05725757562915!2d104.0363948436442!3f252.2606279243012!4f-33.282491262245465!5f0.4000000000000002');

  // Danh sách các địa điểm mẫu
  const sampleLocations = [
    {
      name: 'Bãi Sao, Phú Quốc',
      url: 'https://www.google.com/maps/embed?pb=!4v1747330345274!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ09oN2JLblFF!2m2!1d10.05725757562915!2d104.0363948436442!3f252.2606279243012!4f-33.282491262245465!5f0.4000000000000002',
      description: 'Bãi biển cát trắng nổi tiếng ở Phú Quốc'
    },
    {
      name: 'Hồ Gươm, Hà Nội',
      url: 'https://maps.app.goo.gl/Yx9Qd4Yx9Qd4Yx9Qd4',
      description: 'Hồ nổi tiếng ở trung tâm Hà Nội'
    },
    {
      name: 'Phố cổ Hội An',
      url: 'https://maps.app.goo.gl/Yx9Qd4Yx9Qd4Yx9Qd4',
      description: 'Phố cổ được UNESCO công nhận là Di sản Văn hóa Thế giới'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMapUrl(inputUrl);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Google Maps Street View 360°"
        description="Xem hình ảnh 360° từ Google Maps Street View"
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
            <Input
              type="text"
              placeholder="Nhập URL Google Maps (https://maps.app.goo.gl/...)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Xem</Button>
          </form>

          <div className="text-sm text-muted-foreground mb-6">
            <p>Nhập URL Google Maps Street View để xem hình ảnh 360°. Ví dụ:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>https://maps.app.goo.gl/2HcQS9JHTAsNUZd76 (Bãi Sao, Phú Quốc)</li>
              <li>https://goo.gl/maps/abcdefg123456</li>
            </ul>
          </div>

          <Tabs defaultValue="view">
            <TabsList>
              <TabsTrigger value="view">Xem 360°</TabsTrigger>
              <TabsTrigger value="samples">Địa điểm mẫu</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="mt-6">
              <GoogleMapsView
                mapUrl={mapUrl}
                height="500px"
                title="Google Maps Street View"
                description="Xem hình ảnh 360° từ Google Maps"
              />
            </TabsContent>

            <TabsContent value="samples" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleLocations.map((location, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-[200px]">
                        <GoogleMapsView
                          mapUrl={location.url}
                          height="200px"
                          fullscreenButton={false}
                          resetButton={false}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">{location.name}</h3>
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setMapUrl(location.url);
                            setInputUrl(location.url);
                            document.querySelector('[data-value="view"]')?.dispatchEvent(
                              new MouseEvent('click', { bubbles: true })
                            );
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
          <div className="prose dark:prose-invert max-w-none">
            <h3>Cách nhúng Google Maps Street View vào ứng dụng</h3>
            <p>Để nhúng Google Maps Street View vào ứng dụng, bạn có thể sử dụng component <code>GoogleMapsView</code> như sau:</p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`import { GoogleMapsView } from '@/features/view360';

// Trong component của bạn
<GoogleMapsView
  mapUrl="https://maps.app.goo.gl/2HcQS9JHTAsNUZd76"
  height="500px"
  title="Bãi Sao, Phú Quốc"
  description="Bãi biển cát trắng nổi tiếng ở Phú Quốc"
/>`}
            </pre>

            <h3>Các thuộc tính của component</h3>
            <ul>
              <li><code>mapUrl</code>: URL của Google Maps Street View</li>
              <li><code>height</code>: Chiều cao của component (mặc định: 400px)</li>
              <li><code>width</code>: Chiều rộng của component (mặc định: 100%)</li>
              <li><code>fullscreenButton</code>: Hiển thị nút toàn màn hình (mặc định: true)</li>
              <li><code>resetButton</code>: Hiển thị nút reset (mặc định: true)</li>
              <li><code>title</code>: Tiêu đề hiển thị phía trên Street View</li>
              <li><code>description</code>: Mô tả hiển thị phía trên Street View</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
