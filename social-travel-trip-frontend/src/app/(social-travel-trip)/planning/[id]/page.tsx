'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { TabMenu } from '@/components/common/TabMenu';
import { PlanDetailsView } from '@/features/planning/PlanDetailsView';
import { PlanCreator } from '@/features/planning/PlanCreator';
import { planService, Plan } from '@/features/planning';
import { Card, CardContent } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'view' | 'edit';

export default function PlanningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = parseInt(params.id as string);

  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (planId) {
      loadPlan();
    }
  }, [planId]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const planDetails = await planService.getPlanDetails(planId);
      setPlan(planDetails.plan);
    } catch (error) {
      console.error('Error loading plan:', error);
      setError('Không thể tải chi tiết kế hoạch');
      toast.error('Không thể tải chi tiết kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/planning');
  };

  const handleEdit = () => {
    setViewMode('edit');
  };

  const handleSaveEdit = () => {
    setViewMode('view');
    loadPlan(); // Reload plan data
    toast.success('Kế hoạch đã được cập nhật thành công!');
  };

  const handleCancelEdit = () => {
    setViewMode('view');
  };

  if (loading) {
    return (
      <>
        <TabMenu />
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <PageHeader
              title="Chi tiết kế hoạch"
              description="Đang tải thông tin kế hoạch..."
            />
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-muted-foreground">Đang tải chi tiết kế hoạch...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !plan) {
    return (
      <>
        <TabMenu />
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <PageHeader
              title="Chi tiết kế hoạch"
              description="Có lỗi xảy ra khi tải kế hoạch"
            />
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Không tìm thấy kế hoạch</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'Kế hoạch có thể đã bị xóa hoặc không tồn tại'}
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <TabMenu />
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <PageHeader
            title={viewMode === 'edit' ? 'Chỉnh sửa kế hoạch' : 'Chi tiết kế hoạch'}
            description={viewMode === 'edit' ? 'Cập nhật thông tin kế hoạch của bạn' : plan.name}
          />
        </div>

        <div className="mt-4">
          {viewMode === 'edit' ? (
            <PlanCreator
              onBack={handleCancelEdit}
              onSave={handleSaveEdit}
              initialPlan={plan}
              mode="edit"
            />
          ) : (
            <PlanDetailsView
              planId={planId}
              onBack={handleBack}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </>
  );
}