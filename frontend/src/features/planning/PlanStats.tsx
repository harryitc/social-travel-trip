'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Progress } from '@/components/ui/radix-ui/progress';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  TrendingUp,
  Activity,
  Target,
  CheckCircle
} from 'lucide-react';
import { PlanDetailsModel } from './models/plan.model';

interface PlanStatsProps {
  planDetails: PlanDetailsModel;
  className?: string;
}

export function PlanStats({ planDetails, className }: PlanStatsProps) {
  const { plan, dayPlaces } = planDetails;
  
  // Calculate statistics
  const totalDays = planDetails.getDaysCount();
  const totalPlaces = dayPlaces.length;
  const totalSchedules = planDetails.getTotalSchedulesCount();
  const daysWithPlaces = Object.keys(planDetails.getDayPlacesByDay()).length;
  const completionRate = totalDays > 0 ? (daysWithPlaces / totalDays) * 100 : 0;
  
  // Calculate time distribution
  const timeDistribution = dayPlaces.reduce((acc, place) => {
    place.schedules?.forEach(schedule => {
      if (schedule.start_time) {
        const hour = schedule.start_time.getHours();
        if (hour >= 6 && hour < 12) acc.morning++;
        else if (hour >= 12 && hour < 18) acc.afternoon++;
        else acc.evening++;
      }
    });
    return acc;
  }, { morning: 0, afternoon: 0, evening: 0 });

  const totalTimeSlots = timeDistribution.morning + timeDistribution.afternoon + timeDistribution.evening;

  // Calculate average activities per day
  const avgActivitiesPerDay = totalDays > 0 ? (totalSchedules / totalDays).toFixed(1) : '0';

  const stats = [
    {
      title: 'Tổng số ngày',
      value: totalDays,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Thời gian du lịch'
    },
    {
      title: 'Địa điểm',
      value: totalPlaces,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Nơi sẽ ghé thăm'
    },
    {
      title: 'Hoạt động',
      value: totalSchedules,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Tổng số hoạt động'
    },
    {
      title: 'Trung bình/ngày',
      value: avgActivitiesPerDay,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Hoạt động mỗi ngày'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Tiến độ hoàn thành
            </CardTitle>
            <CardDescription>
              Số ngày đã có lịch trình chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Đã lập kế hoạch</span>
                <span className="font-medium">{daysWithPlaces}/{totalDays} ngày</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completionRate.toFixed(0)}% kế hoạch đã hoàn thành
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Phân bố thời gian
            </CardTitle>
            <CardDescription>
              Hoạt động theo khung giờ trong ngày
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm">Sáng (6h-12h)</span>
                </div>
                <span className="text-sm font-medium">{timeDistribution.morning}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Chiều (12h-18h)</span>
                </div>
                <span className="text-sm font-medium">{timeDistribution.afternoon}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Tối (18h-6h)</span>
                </div>
                <span className="text-sm font-medium">{timeDistribution.evening}</span>
              </div>
              
              {totalTimeSlots === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Chưa có hoạt động nào có thời gian cụ thể
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Thông tin kế hoạch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</p>
              <Badge variant={plan.isPublic() ? 'default' : 'secondary'}>
                {plan.isPublic() ? 'Công khai' : 'Riêng tư'}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Ngày tạo</p>
              <p className="text-sm">{plan.getFormattedCreatedDate()}</p>
            </div>
            
            {plan.getTags().length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {plan.getTags().map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      {totalSchedules > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Kế hoạch chi tiết
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Bạn đã tạo một kế hoạch chi tiết với {totalSchedules} hoạt động 
                  trải dài {totalDays} ngày. Trung bình {avgActivitiesPerDay} hoạt động mỗi ngày 
                  sẽ giúp chuyến đi thú vị và không quá tải.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
