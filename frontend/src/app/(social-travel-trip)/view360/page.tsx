'use client';

import { View360LocationTabs, View360Stats, View360Tips } from '@/features/view360';
import { TabMenu } from '@/components/common/TabMenu';
import { Globe, MapPin } from 'lucide-react';
import '@/features/view360/view360.css';

export default function View360Page() {
  return (
    <>
      <TabMenu />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="view360-container container mx-auto px-4 py-6 space-y-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                View 360°
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Khám phá các địa điểm du lịch tuyệt đẹp với góc nhìn 360 độ từ Google Maps Street View
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <MapPin className="h-4 w-4" />
              <span>Hơn 50+ địa điểm du lịch nổi tiếng</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto mb-8">
            <View360Stats />
          </div>

          {/* Tips Section */}
          <div className="max-w-4xl mx-auto mb-6">
            <View360Tips />
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <View360LocationTabs showInfoCard={true} />
          </div>
        </div>
      </div>
    </>
  );
}
