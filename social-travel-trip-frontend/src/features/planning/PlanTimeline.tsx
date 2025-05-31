'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/radix-ui/button';
import { 
  MapPin, 
  Clock, 
  Calendar,
  ChevronRight,
  Navigation,
  Star,
  Camera,
  Utensils,
  Bed,
  ShoppingBag
} from 'lucide-react';
import { PlanDetailsModel, DayPlaceModel, ScheduleModel } from './models/plan.model';

interface PlanTimelineProps {
  planDetails: PlanDetailsModel;
  onEditDay?: (day: string) => void;
  onEditPlace?: (placeId: number) => void;
  onEditSchedule?: (scheduleId: number) => void;
  readonly?: boolean;
}

export function PlanTimeline({ 
  planDetails, 
  onEditDay, 
  onEditPlace, 
  onEditSchedule,
  readonly = false 
}: PlanTimelineProps) {
  const { plan, dayPlaces } = planDetails;
  const dayPlacesByDay = planDetails.getDayPlacesByDay();
  const sortedDays = planDetails.getSortedDays();

  const getActivityIcon = (activityName: string) => {
    const name = activityName.toLowerCase();
    if (name.includes('ăn') || name.includes('food') || name.includes('restaurant')) {
      return <Utensils className="h-4 w-4" />;
    }
    if (name.includes('ngủ') || name.includes('hotel') || name.includes('nghỉ')) {
      return <Bed className="h-4 w-4" />;
    }
    if (name.includes('mua') || name.includes('shopping') || name.includes('chợ')) {
      return <ShoppingBag className="h-4 w-4" />;
    }
    if (name.includes('chụp') || name.includes('photo') || name.includes('view')) {
      return <Camera className="h-4 w-4" />;
    }
    return <Star className="h-4 w-4" />;
  };

  const getTimeColor = (time: string) => {
    if (!time) return 'text-gray-400';
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'text-orange-500'; // Morning
    if (hour >= 12 && hour < 18) return 'text-blue-500'; // Afternoon
    return 'text-purple-500'; // Evening
  };

  return (
    <div className="space-y-8">
      {/* Plan Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {plan.description}
              </CardDescription>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span>{plan.getLocationName()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{sortedDays.length} ngày</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>{planDetails.getTotalSchedulesCount()} hoạt động</span>
                </div>
              </div>
            </div>
            {plan.thumbnail_url && (
              <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0">
                <img
                  src={plan.thumbnail_url}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {plan.getTags().length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {plan.getTags().map(tag => (
                <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Timeline */}
      <div className="space-y-8">
        {sortedDays.map((day, dayIndex) => {
          const places = dayPlacesByDay[day] || [];
          
          return (
            <div key={day} className="relative">
              {/* Day Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-lg">
                  {day}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Ngày {day}</h2>
                  <p className="text-muted-foreground">
                    {places.length} địa điểm • {places.reduce((total, place) => total + (place.schedules?.length || 0), 0)} hoạt động
                  </p>
                </div>
                {!readonly && onEditDay && (
                  <Button variant="outline" size="sm" onClick={() => onEditDay(day)}>
                    Chỉnh sửa ngày
                  </Button>
                )}
              </div>

              {/* Places Timeline */}
              <div className="ml-6 space-y-6">
                {places.map((place, placeIndex) => (
                  <div key={place.plan_day_place_id} className="relative">
                    {/* Timeline Line */}
                    {placeIndex < places.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-purple-300 to-blue-300 -z-10" />
                    )}
                    
                    {/* Place Card */}
                    <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full">
                              <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{place.getLocationName()}</CardTitle>
                              {place.getLocationDescription() && (
                                <CardDescription className="mt-1">
                                  {place.getLocationDescription()}
                                </CardDescription>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <span>{place.getSchedulesCount()} hoạt động</span>
                              </div>
                            </div>
                          </div>
                          
                          {!readonly && onEditPlace && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onEditPlace(place.plan_day_place_id)}
                            >
                              Chỉnh sửa
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      {/* Schedules */}
                      {place.schedules && place.schedules.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {place.schedules.map((schedule, scheduleIndex) => (
                              <div 
                                key={schedule.plan_schedule_id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                              >
                                <div className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                                  {getActivityIcon(schedule.name)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{schedule.name}</h4>
                                      {schedule.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {schedule.description}
                                        </p>
                                      )}
                                      
                                      <div className="flex items-center gap-4 mt-2 text-xs">
                                        {schedule.hasTime() && (
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span className={getTimeColor(schedule.getFormattedStartTime())}>
                                              {schedule.getFormattedStartTime()}
                                              {schedule.getFormattedEndTime() && (
                                                <> - {schedule.getFormattedEndTime()}</>
                                              )}
                                            </span>
                                            {schedule.getDurationMinutes() > 0 && (
                                              <span className="text-muted-foreground">
                                                ({schedule.getDurationMinutes()} phút)
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        
                                        {schedule.getLocationName() && (
                                          <div className="flex items-center gap-1 text-muted-foreground">
                                            <Navigation className="h-3 w-3" />
                                            <span className="truncate">{schedule.getLocationName()}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {!readonly && onEditSchedule && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => onEditSchedule(schedule.plan_schedule_id)}
                                      >
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                ))}
                
                {places.length === 0 && (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-muted-foreground">Chưa có địa điểm nào cho ngày này</p>
                      {!readonly && (
                        <Button variant="outline" className="mt-2" onClick={() => onEditDay?.(day)}>
                          Thêm địa điểm
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
