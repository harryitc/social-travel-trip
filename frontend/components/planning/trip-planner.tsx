'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, PlusIcon, ChevronDown, ChevronUp, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
};

type Day = {
  id: string;
  date: Date;
  activities: Activity[];
};

export function TripPlanner() {
  const [tripName, setTripName] = useState('');
  const [tripDates, setTripDates] = useState<Date[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  
  const addDay = () => {
    const newDayId = `day-${days.length + 1}`;
    const newDay: Day = {
      id: newDayId,
      date: new Date(),
      activities: [],
    };
    setDays([...days, newDay]);
  };
  
  const removeDay = (dayId: string) => {
    setDays(days.filter(day => day.id !== dayId));
  };
  
  const addActivity = (dayId: string) => {
    const newActivityId = `activity-${Date.now()}`;
    const newActivity: Activity = {
      id: newActivityId,
      time: '',
      title: '',
      description: '',
      location: '',
    };
    
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }
      return day;
    }));
  };
  
  const updateActivity = (dayId: string, activityId: string, field: keyof Activity, value: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.map(activity => {
            if (activity.id === activityId) {
              return {
                ...activity,
                [field]: value,
              };
            }
            return activity;
          }),
        };
      }
      return day;
    }));
  };
  
  const removeActivity = (dayId: string, activityId: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId),
        };
      }
      return day;
    }));
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceDay = result.source.droppableId;
    const destDay = result.destination.droppableId;
    
    if (sourceDay === destDay) {
      // Reordering within the same day
      const day = days.find(d => d.id === sourceDay);
      if (!day) return;
      
      const activities = [...day.activities];
      const [removed] = activities.splice(result.source.index, 1);
      activities.splice(result.destination.index, 0, removed);
      
      setDays(days.map(d => {
        if (d.id === sourceDay) {
          return { ...d, activities };
        }
        return d;
      }));
    } else {
      // Moving between days
      const sourceDay = days.find(d => d.id === result.source.droppableId);
      const destDay = days.find(d => d.id === result.destination.droppableId);
      
      if (!sourceDay || !destDay) return;
      
      const sourceActivities = [...sourceDay.activities];
      const destActivities = [...destDay.activities];
      
      const [removed] = sourceActivities.splice(result.source.index, 1);
      destActivities.splice(result.destination.index, 0, removed);
      
      setDays(days.map(d => {
        if (d.id === result.source.droppableId) {
          return { ...d, activities: sourceActivities };
        }
        if (d.id === result.destination.droppableId) {
          return { ...d, activities: destActivities };
        }
        return d;
      }));
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Lập kế hoạch cho chuyến đi</CardTitle>
          <CardDescription>
            Tạo lịch trình chi tiết với các hoạt động cho từng ngày
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trip-name">Tên chuyến đi</Label>
              <Input
                id="trip-name"
                placeholder="Nhập tên chuyến đi"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ngày đi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tripDates.length && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tripDates.length > 0 ? (
                      <span>
                        {format(tripDates[0], "dd/MM/yyyy", { locale: vi })} - {format(tripDates[tripDates.length - 1], "dd/MM/yyyy", { locale: vi })}
                      </span>
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={{ 
                      from: tripDates[0] || undefined, 
                      to: tripDates[tripDates.length - 1] || undefined 
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        // Create an array of dates between from and to
                        const dates: Date[] = [];
                        const current = new Date(range.from);
                        
                        while (current <= range.to) {
                          dates.push(new Date(current));
                          current.setDate(current.getDate() + 1);
                        }
                        
                        setTripDates(dates);
                        
                        // Create a day for each date
                        setDays(dates.map((date, index) => ({
                          id: `day-${index + 1}`,
                          date,
                          activities: [],
                        })));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {days.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Tabs defaultValue={days[0].id} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 mb-4">
              {days.map((day, index) => (
                <TabsTrigger key={day.id} value={day.id} className="text-sm">
                  Ngày {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {days.map((day, dayIndex) => (
              <TabsContent key={day.id} value={day.id} className="space-y-4">
                <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Ngày {dayIndex + 1} - {format(day.date, "dd/MM/yyyy", { locale: vi })}
                      </CardTitle>
                      <CardDescription>
                        Các hoạt động cho ngày này
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeDay(day.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={day.id}>
                      {(provided) => (
                        <div 
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {day.activities.map((activity, activityIndex) => (
                            <Draggable 
                              key={activity.id} 
                              draggableId={activity.id} 
                              index={activityIndex}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="border border-purple-100 dark:border-purple-900 rounded-lg p-3 space-y-3 bg-white/50 dark:bg-gray-950/50"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        placeholder="Thời gian"
                                        className="w-24"
                                        value={activity.time}
                                        onChange={(e) => updateActivity(day.id, activity.id, 'time', e.target.value)}
                                      />
                                      <Input
                                        placeholder="Hoạt động"
                                        value={activity.title}
                                        onChange={(e) => updateActivity(day.id, activity.id, 'title', e.target.value)}
                                      />
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => removeActivity(day.id, activity.id)}
                                      className="h-8 w-8 text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                      placeholder="Địa điểm"
                                      value={activity.location}
                                      onChange={(e) => updateActivity(day.id, activity.id, 'location', e.target.value)}
                                    />
                                    <Textarea
                                      placeholder="Mô tả chi tiết"
                                      className="min-h-[60px] resize-none"
                                      value={activity.description}
                                      onChange={(e) => updateActivity(day.id, activity.id, 'description', e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    
                    <Button
                      variant="outline"
                      onClick={() => addActivity(day.id)}
                      className="w-full mt-4 border-dashed border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Thêm hoạt động
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </DragDropContext>
      )}
      
      {days.length === 0 && (
        <Button onClick={addDay} className="w-full">
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm ngày đầu tiên
        </Button>
      )}
      
      {days.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={addDay}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Thêm ngày
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Lưu kế hoạch
          </Button>
        </div>
      )}
    </div>
  );
}