'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, PlusIcon, ChevronDown, ChevronUp, Trash2, Save, LayoutTemplate, ListTodo, FileEdit, Check, Image as ImageIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TemplateSelector } from './template-selector';
import { TripTemplate } from './trip-templates';
import { SavedTripsList } from './saved-trips-list';
import { SavedTrip } from './saved-trips';
import { useTrips } from './trip-context';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs as TabsUI,
  TabsContent as TabsContentUI,
  TabsList as TabsListUI,
  TabsTrigger as TabsTriggerUI,
} from "@/components/ui/tabs";

export type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
};

export type Day = {
  id: string;
  date: Date;
  activities: Activity[];
};

export function TripPlanner() {
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [tripImage, setTripImage] = useState('https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [tripDates, setTripDates] = useState<Date[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new');
  const [editingTrip, setEditingTrip] = useState<SavedTrip | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageTab, setImageTab] = useState<'sample' | 'upload'>('sample');

  const { savedTrips, addTrip } = useTrips();
  const { toast } = useToast();
  const tripIdRef = useRef<string>(`trip-${Date.now()}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Array of sample trip images
  const sampleImages = [
    'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4428272/pexels-photo-4428272.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/5739051/pexels-photo-5739051.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File quá lớn",
          description: "Kích thước file không được vượt quá 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          // Also set as the selected image
          setTripImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear custom image
  const clearCustomImage = () => {
    setCustomImage(null);
    setTripImage(sampleImages[0]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addDay = () => {
    // If no trip dates are selected, use today as the start date
    if (tripDates.length === 0) {
      const today = new Date();
      const newDay: Day = {
        id: `day-1`,
        date: today,
        activities: [],
      };
      setDays([newDay]);
      setTripDates([today]);
      return;
    }

    // Get the last date and add one day
    const lastDate = new Date(tripDates[tripDates.length - 1]);
    const newDate = new Date(lastDate);
    newDate.setDate(lastDate.getDate() + 1);

    const newDayId = `day-${days.length + 1}`;
    const newDay: Day = {
      id: newDayId,
      date: newDate,
      activities: [],
    };

    // Update both days and tripDates
    setDays([...days, newDay]);
    setTripDates([...tripDates, newDate]);
  };

  const removeDay = (dayId: string) => {
    const dayToRemove = days.find(day => day.id === dayId);
    if (!dayToRemove) return;

    // Remove the day from days array
    setDays(days.filter(day => day.id !== dayId));

    // Also remove the date from tripDates
    const dateToRemove = dayToRemove.date;
    setTripDates(tripDates.filter(date =>
      date.getDate() !== dateToRemove.getDate() ||
      date.getMonth() !== dateToRemove.getMonth() ||
      date.getFullYear() !== dateToRemove.getFullYear()
    ));
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

  // Handle template selection
  const handleSelectTemplate = (template: TripTemplate) => {
    // Set trip name and description from template
    setTripName(template.name);
    setTripDescription(template.description);
    setTripImage(template.image);

    // Create dates based on template duration
    const startDate = new Date();
    const dates: Date[] = [];

    for (let i = 0; i < template.duration; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    setTripDates(dates);

    // Create days with activities from template
    const newDays: Day[] = template.days.map((templateDay, index) => {
      return {
        id: `day-${index + 1}`,
        date: dates[index],
        activities: templateDay.activities.map((activity, activityIndex) => ({
          id: `activity-${Date.now()}-${index}-${activityIndex}`,
          time: activity.time,
          title: activity.title,
          description: activity.description,
          location: activity.location,
        })),
      };
    });

    setDays(newDays);
  };

  const handleEditTrip = (trip: SavedTrip) => {
    setEditingTrip(trip);
    setActiveTab('new');

    // Set trip details
    setTripName(trip.name);
    setTripDescription(trip.description);

    // Handle image (could be custom or from samples)
    if (trip.image.startsWith('data:')) {
      setCustomImage(trip.image);
      setImageTab('upload');
    } else {
      setCustomImage(null);
      setImageTab('sample');
    }
    setTripImage(trip.image);
    tripIdRef.current = trip.id;

    // Create dates based on trip start and end dates
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const dates: Date[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setTripDates(dates);

    // Check if the trip has an itinerary
    if (trip.itinerary && Array.isArray(trip.itinerary) && trip.itinerary.length > 0) {
      // Convert the itinerary to the Day format
      const loadedDays = trip.itinerary.map((day, index) => ({
        id: day.id || `day-${index + 1}`,
        date: new Date(day.date),
        activities: day.activities.map(activity => ({
          id: activity.id || `activity-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          time: activity.time || '09:00',
          title: activity.title || '',
          description: activity.description || '',
          location: activity.location || '',
        })),
      }));

      setDays(loadedDays);
    } else {
      // If no itinerary, create empty days
      setDays(dates.map((date, index) => ({
        id: `day-${index + 1}`,
        date,
        activities: [],
      })));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'new' | 'saved')} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="new" className="flex items-center">
              <FileEdit className="h-4 w-4 mr-2" />
              Tạo kế hoạch mới
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center">
              <ListTodo className="h-4 w-4 mr-2" />
              Kế hoạch đã lưu
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="new" className="space-y-6">
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
              <Label className="flex items-center justify-between">
                <span>Ngày đi</span>
                <span className="text-xs text-muted-foreground">(Chọn ngày bắt đầu và kết thúc)</span>
              </Label>
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
                      if (range?.from) {
                        // If only from date is selected, use it as a single day
                        if (!range.to) {
                          const singleDate = new Date(range.from);
                          setTripDates([singleDate]);

                          // Create a single day
                          setDays([{
                            id: 'day-1',
                            date: singleDate,
                            activities: [],
                          }]);
                          return;
                        }

                        // Create an array of dates between from and to
                        const dates: Date[] = [];
                        const current = new Date(range.from);

                        while (current <= range.to) {
                          dates.push(new Date(current));
                          current.setDate(current.getDate() + 1);
                        }

                        setTripDates(dates);

                        // Preserve existing activities if possible
                        if (days.length > 0) {
                          // Create a map of existing activities by date string
                          const existingActivitiesByDate = new Map<string, Activity[]>();
                          days.forEach(day => {
                            const dateStr = format(day.date, 'yyyy-MM-dd');
                            existingActivitiesByDate.set(dateStr, day.activities);
                          });

                          // Create new days, preserving activities where possible
                          const newDays = dates.map((date, index) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const existingActivities = existingActivitiesByDate.get(dateStr) || [];

                            return {
                              id: `day-${index + 1}`,
                              date,
                              activities: existingActivities,
                            };
                          });

                          setDays(newDays);
                        } else {
                          // If no existing days, create empty ones
                          setDays(dates.map((date, index) => ({
                            id: `day-${index + 1}`,
                            date,
                            activities: [],
                          })));
                        }
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Template selector */}
          <div className="pt-4 border-t mt-4">
            <div className="flex items-center mb-2">
              <LayoutTemplate className="h-4 w-4 mr-2 text-purple-500" />
              <Label>Template chuyến đi</Label>
            </div>
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
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
        <div className="space-y-4">
          <Card className="border-dashed border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-950/50 p-6">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
                <p className="mb-2">Bạn có thể bắt đầu lập kế hoạch bằng cách:</p>
                <ul className="text-sm list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                  <li>Chọn ngày đi trong lịch ở trên</li>
                  <li>Chọn một template có sẵn</li>
                  <li>Hoặc thêm ngày đầu tiên thủ công</li>
                </ul>
              </div>
              <Button onClick={addDay} className="w-full md:w-auto">
                <PlusIcon className="h-4 w-4 mr-2" />
                Thêm ngày đầu tiên
              </Button>
            </div>
          </Card>
        </div>
      )}

      {days.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="text-sm text-muted-foreground flex items-center">
            <span className="mr-2">Tổng số ngày:</span>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
              {days.length} ngày
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={addDay} className="border-dashed border-purple-200 dark:border-purple-800">
              <PlusIcon className="h-4 w-4 mr-2" />
              Thêm ngày
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                if (!tripName) {
                  toast({
                    title: "Thiếu thông tin",
                    description: "Vui lòng nhập tên chuyến đi",
                    variant: "destructive",
                  });
                  return;
                }

                if (tripDates.length === 0) {
                  toast({
                    title: "Thiếu thông tin",
                    description: "Vui lòng chọn ngày đi",
                    variant: "destructive",
                  });
                  return;
                }

                setShowSaveDialog(true);
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu kế hoạch
            </Button>
          </div>
        </div>
      )}
        </TabsContent>

        <TabsContent value="saved">
          <SavedTripsList onEditTrip={handleEditTrip} />
        </TabsContent>
      </Tabs>

      {/* Save Trip Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lưu kế hoạch chuyến đi</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết để lưu kế hoạch chuyến đi của bạn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-trip-name">Tên chuyến đi</Label>
              <Input
                id="save-trip-name"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Nhập tên chuyến đi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="save-trip-description">Mô tả</Label>
              <Textarea
                id="save-trip-description"
                value={tripDescription}
                onChange={(e) => setTripDescription(e.target.value)}
                placeholder="Mô tả ngắn về chuyến đi của bạn"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Ảnh đại diện</Label>
              <TabsUI value={imageTab} onValueChange={(value) => setImageTab(value as 'sample' | 'upload')}>
                <TabsListUI className="grid w-full grid-cols-2">
                  <TabsTriggerUI value="sample" className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Mẫu có sẵn
                  </TabsTriggerUI>
                  <TabsTriggerUI value="upload" className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Tải lên
                  </TabsTriggerUI>
                </TabsListUI>

                <TabsContentUI value="sample" className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sampleImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 ${image === tripImage ? 'border-purple-500' : 'border-transparent'}`}
                        onClick={() => setTripImage(image)}
                      >
                        {/* eslint-disable-next-line */}
                        <img src={image} alt="Trip cover" className="object-cover w-full h-full" />
                        {image === tripImage && (
                          <div className="absolute top-1 right-1 bg-purple-500 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContentUI>

                <TabsContentUI value="upload" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="trip-image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
                      >
                        {customImage ? (
                          <div className="relative w-full h-full">
                            {/* eslint-disable-next-line */}
                            <img
                              src={customImage}
                              alt="Uploaded preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearCustomImage();
                              }}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Nhấn để tải ảnh lên</span> hoặc kéo thả
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG hoặc GIF (tối đa 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="trip-image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                  </div>
                </TabsContentUI>
              </TabsUI>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setIsSaving(true);

                // Convert days to itinerary format
                const itinerary = days.map(day => ({
                  id: day.id,
                  date: format(day.date, 'yyyy-MM-dd'),
                  activities: day.activities.map(activity => ({
                    id: activity.id,
                    time: activity.time || '09:00',
                    title: activity.title,
                    description: activity.description || '',
                    location: activity.location || '',
                  }))
                }));

                // Create the saved trip object
                const savedTrip: SavedTrip = {
                  id: tripIdRef.current,
                  name: tripName,
                  description: tripDescription || `Kế hoạch chuyến đi ${tripName}`,
                  image: tripImage,
                  startDate: format(tripDates[0], 'yyyy-MM-dd'),
                  endDate: format(tripDates[tripDates.length - 1], 'yyyy-MM-dd'),
                  days: days.length,
                  itinerary: itinerary,
                  createdAt: editingTrip?.createdAt || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                // Save the trip and ensure it's properly stored in localStorage
                addTrip(savedTrip);

                // Force a localStorage update to ensure data persistence
                localStorage.setItem('savedTrips', JSON.stringify(
                  editingTrip
                    ? savedTrips.map(t => t.id === savedTrip.id ? savedTrip : t)
                    : [...savedTrips, savedTrip]
                ));

                // Dispatch a storage event to notify other components
                window.dispatchEvent(new Event('storage'));

                // No success message as per user request

                // Close dialog and reset saving state
                setShowSaveDialog(false);
                setIsSaving(false);

                // Generate a new ID for the next trip
                if (!editingTrip) {
                  tripIdRef.current = `trip-${Date.now()}`;
                }

                // Switch to saved tab
                setActiveTab('saved');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSaving || !tripName}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu kế hoạch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}