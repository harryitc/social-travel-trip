'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Copy,
  Share,
  Globe,
  Lock,
  User,
  Loader2,
  Users
} from 'lucide-react';
import { planService, Plan, PlanDetails, DayPlace, Schedule } from './services/plan.service';
import { ApplyPlanToGroup } from './ApplyPlanToGroup';
import { PlanTimeline } from './PlanTimeline';
import { PlanStats } from './PlanStats';
import { SharePlan } from './SharePlan';
import { toast } from 'sonner';

interface PlanDetailsViewProps {
  planId: number;
  onBack: () => void;
  onEdit?: (plan: Plan) => void;
  onApplyToGroup?: (plan: Plan) => void;
}

export function PlanDetailsView({
  planId,
  onBack,
  onEdit,
  onApplyToGroup
}: PlanDetailsViewProps) {
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    loadPlanDetails();
  }, [planId]);

  const loadPlanDetails = async () => {
    try {
      setLoading(true);
      const details = await planService.getPlanDetails(planId);
      setPlanDetails(details);
    } catch (error) {
      console.error('Error loading plan details:', error);
      toast.error('Không thể tải chi tiết kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (planDetails?.plan && onEdit) {
      onEdit(planDetails.plan);
    }
  };

  const handleApplyToGroup = () => {
    setShowApplyDialog(true);
  };

  const handleCopyPlan = () => {
    // TODO: Implement copy plan functionality
    toast.info('Chức năng sao chép kế hoạch đang được phát triển');
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-muted-foreground">Đang tải chi tiết kế hoạch...</p>
        </div>
      </div>
    );
  }

  if (!planDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Không tìm thấy kế hoạch</h3>
        <p className="text-muted-foreground mt-2">Kế hoạch có thể đã bị xóa hoặc không tồn tại</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  const { plan, dayPlaces } = planDetails;

  // Group day places by day
  const dayPlacesByDay = dayPlaces.reduce((acc, dayPlace) => {
    if (!acc[dayPlace.ngay]) {
      acc[dayPlace.ngay] = [];
    }
    acc[dayPlace.ngay].push(dayPlace);
    return acc;
  }, {} as Record<string, DayPlace[]>);

  const days = Object.keys(dayPlacesByDay).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline" onClick={handleCopyPlan}>
            <Copy className="h-4 w-4 mr-2" />
            Sao chép
          </Button>
          {onEdit && (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
          {onApplyToGroup && (
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleApplyToGroup}>
              <Users className="h-4 w-4 mr-2" />
              Áp dụng cho nhóm
            </Button>
          )}
        </div>
      </div>

      {/* Plan Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {plan.status === 'public' ? (
                  <Badge className="bg-green-500">
                    <Globe className="h-3 w-3 mr-1" />
                    Công khai
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Riêng tư
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{plan.location?.name || 'Chưa có địa điểm'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(plan.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{days.length} ngày</span>
                </div>
              </div>
            </div>

            {plan.thumbnail_url && (
              <div className="w-32 h-20 rounded-lg overflow-hidden">
                <img
                  src={plan.thumbnail_url}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {plan.description && (
            <CardDescription className="text-base mt-4">
              {plan.description}
            </CardDescription>
          )}

          {plan.json_data?.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {plan.json_data.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Plan Content */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Lịch trình</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <PlanTimeline
            planDetails={planDetails}
            readonly={true}
          />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <PlanStats planDetails={planDetails} />
        </TabsContent>
      </Tabs>

      {/* Apply to Group Dialog */}
      {planDetails && (
        <ApplyPlanToGroup
          plan={planDetails.plan}
          isOpen={showApplyDialog}
          onClose={() => setShowApplyDialog(false)}
          onSuccess={() => {
            toast.success('Kế hoạch đã được áp dụng thành công!');
            setShowApplyDialog(false);
          }}
        />
      )}

      {/* Share Plan Dialog */}
      {planDetails && (
        <SharePlan
          plan={planDetails.plan}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
