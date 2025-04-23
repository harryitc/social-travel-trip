import { PageHeader } from '@/components/ui/page-header';
import { TripPlanner } from '@/components/planning/trip-planner';
import { TravelTemplates } from '@/components/planning/travel-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlanningPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Lập kế hoạch"
        description="Lên lịch trình cho chuyến đi của bạn"
      />

      <div className="mt-8">
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="planner">Lập kế hoạch</TabsTrigger>
            <TabsTrigger value="templates">Mẫu kế hoạch</TabsTrigger>
          </TabsList>

          <TabsContent value="planner">
            <TripPlanner />
          </TabsContent>

          <TabsContent value="templates">
            <TravelTemplates />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}