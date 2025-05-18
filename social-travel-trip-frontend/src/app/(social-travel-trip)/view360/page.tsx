'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { View360LocationTabs } from '@/features/view360';

export default function View360Page() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="View 360°"
        description="Khám phá các địa điểm du lịch với góc nhìn 360 độ từ Google Maps Street View"
      />

      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <View360LocationTabs showInfoCard={false} />
        </CardContent>
      </Card>

      
    </div>
  );
}
