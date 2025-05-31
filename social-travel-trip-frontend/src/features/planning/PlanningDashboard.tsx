'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import {
  PlusCircleIcon,
  BookOpenIcon,
  ListIcon,
  UsersIcon,
  MapIcon,
  CalendarIcon,
  TrendingUpIcon,
  StarIcon
} from 'lucide-react';
import { PlansList } from './PlansList';
import { PlanDetailsView } from './PlanDetailsView';
import { PlanCreator } from './PlanCreator';
import { TravelTemplates } from './travel-templates';
import { Plan } from './services/plan.service';

type ViewType = 'dashboard' | 'plans' | 'templates' | 'create' | 'plan-details' | 'my-plans' | 'groups';

export function PlanningDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentView('plan-details');
  };

  const handleCreateNew = () => {
    setCurrentView('create');
  };

  const handleSaveNewPlan = (planId: number) => {
    console.log('Plan created with ID:', planId);
    setCurrentView('dashboard');
  };

  // Render different views
  if (currentView === 'create') {
    return (
      <PlanCreator
        onBack={() => setCurrentView('dashboard')}
        onSave={handleSaveNewPlan}
      />
    );
  }

  if (currentView === 'plan-details' && selectedPlan) {
    return (
      <PlanDetailsView
        planId={selectedPlan.plan_id}
        onBack={() => setCurrentView('plans')}
        onEdit={(plan) => {
          // TODO: Implement edit functionality
          console.log('Edit plan:', plan);
        }}
        onApplyToGroup={(plan) => {
          // TODO: Implement apply to group functionality
          console.log('Apply to group:', plan);
        }}
      />
    );
  }

  if (currentView === 'plans') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Kế hoạch từ cộng đồng</h2>
            <p className="text-muted-foreground">Khám phá các kế hoạch du lịch được chia sẻ bởi cộng đồng</p>
          </div>
          <Button onClick={() => setCurrentView('dashboard')} variant="outline">
            Quay lại tổng quan
          </Button>
        </div>
        <PlansList
          onSelectPlan={handleSelectPlan}
          onCreateNew={handleCreateNew}
        />
      </div>
    );
  }

  if (currentView === 'templates') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Mẫu kế hoạch</h2>
            <p className="text-muted-foreground">Sử dụng các mẫu kế hoạch có sẵn để tạo chuyến đi của bạn</p>
          </div>
          <Button onClick={() => setCurrentView('dashboard')} variant="outline">
            Quay lại tổng quan
          </Button>
        </div>
        <TravelTemplates />
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Chào mừng đến với Lập kế hoạch</CardTitle>
          <CardDescription className="text-purple-100">
            Tạo, quản lý và chia sẻ các kế hoạch du lịch tuyệt vời
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCreateNew}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Tạo kế hoạch mới
            </Button>
            <Button
              onClick={() => setCurrentView('plans')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <ListIcon className="h-4 w-4 mr-2" />
              Xem kế hoạch cộng đồng
            </Button>
            <Button
              onClick={() => setCurrentView('templates')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Duyệt mẫu kế hoạch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Kế hoạch công khai</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Nhóm đang sử dụng</p>
                <p className="text-2xl font-bold">567</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Mẫu kế hoạch</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tạo tuần này</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Kế hoạch gần đây
            </CardTitle>
            <CardDescription>
              Các kế hoạch được tạo hoặc cập nhật gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Kế hoạch du lịch Đà Nẵng</p>
                      <p className="text-sm text-muted-foreground">Cập nhật 2 giờ trước</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Xem</Button>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setCurrentView('plans')}
              className="w-full mt-4"
              variant="outline"
            >
              Xem tất cả
            </Button>
          </CardContent>
        </Card>

        {/* Popular Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="h-5 w-5" />
              Mẫu phổ biến
            </CardTitle>
            <CardDescription>
              Các mẫu kế hoạch được sử dụng nhiều nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Khám phá Sapa 3 ngày</p>
                      <p className="text-sm text-muted-foreground">Được sử dụng 156 lần</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Dùng</Button>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setCurrentView('templates')}
              className="w-full mt-4"
              variant="outline"
            >
              Xem tất cả mẫu
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
