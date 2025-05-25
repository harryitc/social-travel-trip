'use client';

import { PageHeader } from '@/components/ui/page-header';
import { PlanningDashboard } from '@/features/planning/PlanningDashboard';
import { TabMenu } from '@/components/common/TabMenu';

export default function PlanningPage() {
  return (
    <>
      <TabMenu />
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <PageHeader
            title="Lập kế hoạch"
            description="Tạo và quản lý lịch trình cho chuyến đi của bạn"
          />
        </div>

        <div className="mt-4">
          <PlanningDashboard />
        </div>
      </div>
    </>
  );
}