import { PageHeader } from '@/components/ui/page-header';
import { TripPlanner } from '@/components/planning/trip-planner';

export default function PlanningPage() {
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Lập kế hoạch" 
        description="Lên lịch trình cho chuyến đi của bạn"
      />
      
      <div className="mt-8">
        <TripPlanner />
      </div>
    </div>
  );
}