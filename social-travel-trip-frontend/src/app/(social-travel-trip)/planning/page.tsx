'use client';

import { PageHeader } from '@/components/ui/page-header';
import { TravelTemplates } from '@/features/planning/travel-templates';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/radix-ui/button';
import { TabMenu } from '@/components/common/TabMenu';

export default function PlanningPage() {
  return (
    <>
      <TabMenu />
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <PageHeader
            title="Lập kế hoạch"
            description="Lên lịch trình cho chuyến đi của bạn"
          />
          <div className="flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Tạo kế hoạch mới
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <TravelTemplates />
        </div>
      </div>
    </>
  );
}