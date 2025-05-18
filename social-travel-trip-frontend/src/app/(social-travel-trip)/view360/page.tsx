'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { View360LocationTabs } from '@/features/view360';

export default function View360Page() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="View 360°"
        description="Khám phá các địa điểm du lịch với góc nhìn 360 độ"
      />

      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <View360LocationTabs showInfoCard={false} />
        </CardContent>
      </Card>

      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
          <div className="prose dark:prose-invert max-w-none">
            <h3>Cách sử dụng View 360°</h3>
            <p>
              Tính năng View 360° cho phép bạn khám phá các địa điểm du lịch với góc nhìn 360 độ từ Google Maps Street View.
            </p>

            <h4>Tìm kiếm địa điểm</h4>
            <p>
              Sử dụng thanh tìm kiếm phía trên để tìm kiếm các địa điểm có sẵn trong hệ thống. Bạn có thể tìm kiếm theo:
            </p>
            <ul>
              <li>Tên địa điểm (ví dụ: "Bãi Sao", "Hòn Thơm")</li>
              <li>Thành phố (ví dụ: "Phú Quốc", "Đà Lạt")</li>
              <li>Vùng miền (ví dụ: "Miền Nam", "Miền Bắc")</li>
              <li>Mô tả (ví dụ: "biển", "cáp treo")</li>
            </ul>
            <p>
              Kết quả tìm kiếm sẽ hiển thị ngay bên dưới thanh tìm kiếm. Nhấp vào kết quả để xem hình ảnh 360° của địa điểm đó.
            </p>

            <h4>Lọc theo vùng miền</h4>
            <p>
              Bạn có thể lọc các địa điểm theo vùng miền bằng cách nhấp vào các nhãn vùng miền phía dưới thanh tìm kiếm. Hệ thống sẽ hiển thị tất cả các địa điểm thuộc vùng miền đó.
            </p>

            <h4>Điều hướng trong hình ảnh 360°</h4>
            <p>
              Khi xem hình ảnh 360°, bạn có thể:
            </p>
            <ul>
              <li>Kéo chuột để xoay góc nhìn</li>
              <li>Sử dụng bánh xe chuột để phóng to/thu nhỏ</li>
              <li>Nhấp vào các điều khiển trên màn hình để di chuyển</li>
              <li>Nhấp vào nút toàn màn hình để xem ở chế độ toàn màn hình</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
