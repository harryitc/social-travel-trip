'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Calendar,
  Tag,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import { planService, CreatePlanRequest, CreateDayPlaceRequest, CreateScheduleRequest, Plan, PlanDetails } from './services/plan.service';
import { toast } from 'sonner';

interface PlanCreatorProps {
  onBack: () => void;
  onSave?: (planId: number) => void;
  initialPlan?: Plan;
  mode?: 'create' | 'edit';
}

interface DayPlace {
  id: string;
  day: number;
  name: string;
  description: string;
  lat?: number;
  lon?: number;
  schedules: Schedule[];
}

interface Schedule {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  lat?: number;
  lon?: number;
}

export function PlanCreator({ onBack, onSave, initialPlan, mode = 'create' }: PlanCreatorProps) {
  // Basic plan info
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planLocation, setPlanLocation] = useState('');
  const [planLocationLat, setPlanLocationLat] = useState<number | undefined>();
  const [planLocationLon, setPlanLocationLon] = useState<number | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<'public' | 'private'>('private');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [days, setDays] = useState(3);

  // Day places and schedules
  const [dayPlaces, setDayPlaces] = useState<DayPlace[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialPlan) {
      loadPlanData();
    }
  }, [mode, initialPlan]);

  const loadPlanData = async () => {
    if (!initialPlan) return;

    try {
      setLoading(true);

      // Load basic plan info
      setPlanName(initialPlan.name);
      setPlanDescription(initialPlan.description || '');
      setPlanLocation(initialPlan.location?.name || '');
      setPlanLocationLat(initialPlan.location?.lat);
      setPlanLocationLon(initialPlan.location?.lon);
      setThumbnailUrl(initialPlan.thumbnail_url || '');
      setStatus(initialPlan.status as 'public' | 'private');
      setTags(initialPlan.json_data?.tags || []);

      // Load plan details with day places and schedules
      const planDetails = await planService.getPlanDetails(initialPlan.plan_id);
      const daysCount = planDetails.getDaysCount() || 3;
      setDays(daysCount);

      // Convert backend data to frontend format
      const dayPlacesData: DayPlace[] = [];
      const dayPlacesByDay = planDetails.getDayPlacesByDay();

      Object.entries(dayPlacesByDay).forEach(([day, places]) => {
        places.forEach((place, index) => {
          const schedules: Schedule[] = place.schedules?.map((schedule, scheduleIndex) => ({
            id: `schedule-${place.plan_day_place_id}-${scheduleIndex}`,
            name: schedule.name,
            description: schedule.description,
            startTime: schedule.start_time ? schedule.getFormattedStartTime() : '',
            endTime: schedule.end_time ? schedule.getFormattedEndTime() : '',
            location: schedule.getLocationName(),
            lat: schedule.location?.lat,
            lon: schedule.location?.lon
          })) || [];

          dayPlacesData.push({
            id: `place-${place.plan_day_place_id}`,
            day: parseInt(day),
            name: place.getLocationName(),
            description: place.getLocationDescription(),
            lat: place.location?.lat,
            lon: place.location?.lon,
            schedules
          });
        });
      });

      setDayPlaces(dayPlacesData);
    } catch (error) {
      console.error('Error loading plan data:', error);
      toast.error('Không thể tải dữ liệu kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Add day place
  const handleAddDayPlace = () => {
    const newPlace: DayPlace = {
      id: `place-${Date.now()}`,
      day: currentDay,
      name: '',
      description: '',
      schedules: []
    };
    setDayPlaces([...dayPlaces, newPlace]);
  };

  // Update day place
  const handleUpdateDayPlace = (placeId: string, updates: Partial<DayPlace>) => {
    setDayPlaces(dayPlaces.map(place =>
      place.id === placeId ? { ...place, ...updates } : place
    ));
  };

  // Remove day place
  const handleRemoveDayPlace = (placeId: string) => {
    setDayPlaces(dayPlaces.filter(place => place.id !== placeId));
  };

  // Add schedule to place
  const handleAddSchedule = (placeId: string) => {
    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      location: ''
    };

    setDayPlaces(dayPlaces.map(place =>
      place.id === placeId
        ? { ...place, schedules: [...place.schedules, newSchedule] }
        : place
    ));
  };

  // Update schedule
  const handleUpdateSchedule = (placeId: string, scheduleId: string, updates: Partial<Schedule>) => {
    setDayPlaces(dayPlaces.map(place =>
      place.id === placeId
        ? {
            ...place,
            schedules: place.schedules.map(schedule =>
              schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
            )
          }
        : place
    ));
  };

  // Remove schedule
  const handleRemoveSchedule = (placeId: string, scheduleId: string) => {
    setDayPlaces(dayPlaces.map(place =>
      place.id === placeId
        ? {
            ...place,
            schedules: place.schedules.filter(schedule => schedule.id !== scheduleId)
          }
        : place
    ));
  };

  // Save plan
  const handleSave = async () => {
    if (!planName.trim()) {
      toast.error('Vui lòng nhập tên kế hoạch');
      return;
    }

    if (!planLocation.trim()) {
      toast.error('Vui lòng nhập địa điểm');
      return;
    }

    try {
      setSaving(true);

      if (mode === 'edit' && initialPlan) {
        await handleUpdatePlan();
      } else {
        await handleCreatePlan();
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(`Có lỗi xảy ra khi ${mode === 'edit' ? 'cập nhật' : 'tạo'} kế hoạch`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePlan = async () => {
    // Create plan
    const planData: CreatePlanRequest = {
      name: planName,
      description: planDescription,
      days: days,
      location: {
        name: planLocation,
        description: planDescription,
        lat: planLocationLat || 0,
        lon: planLocationLon || 0
      },
      thumbnail_url: thumbnailUrl,
      status: status,
      json_data: {
        name_khong_dau: planName.toLowerCase().replace(/\s+/g, ' '),
        tags: tags
      }
    };

    const createdPlan = await planService.createPlan(planData);

    // Create day places and schedules
    for (const dayPlace of dayPlaces) {
      if (dayPlace.name.trim()) {
        const dayPlaceData: CreateDayPlaceRequest = {
          plan_id: createdPlan.plan_id,
          ngay: dayPlace.day.toString(),
          location: {
            name: dayPlace.name,
            description: dayPlace.description,
            lat: dayPlace.lat || 0,
            lon: dayPlace.lon || 0
          }
        };

        const createdDayPlace = await planService.createDayPlace(dayPlaceData);

        // Create schedules for this day place
        for (const schedule of dayPlace.schedules) {
          if (schedule.name.trim()) {
            const scheduleData: CreateScheduleRequest = {
              name: schedule.name,
              description: schedule.description,
              start_time: schedule.startTime ? new Date(`2024-01-01T${schedule.startTime}:00`) : undefined,
              end_time: schedule.endTime ? new Date(`2024-01-01T${schedule.endTime}:00`) : undefined,
              location: {
                name: schedule.location,
                description: schedule.description,
                lat: schedule.lat || 0,
                lon: schedule.lon || 0
              },
              plan_day_place_id: createdDayPlace.plan_day_place_id
            };

            await planService.createSchedule(scheduleData);
          }
        }
      }
    }

    toast.success('Kế hoạch đã được tạo thành công!');

    if (onSave) {
      onSave(createdPlan.plan_id);
    } else {
      onBack();
    }
  };

  const handleUpdatePlan = async () => {
    if (!initialPlan) return;

    // Update basic plan info
    const planData = {
      name: planName,
      description: planDescription,
      days: days,
      location: {
        name: planLocation,
        description: planDescription,
        lat: planLocationLat || 0,
        lon: planLocationLon || 0
      },
      thumbnail_url: thumbnailUrl,
      status: status,
      json_data: {
        name_khong_dau: planName.toLowerCase().replace(/\s+/g, ' '),
        tags: tags
      }
    };

    await planService.updatePlanBasic(initialPlan.plan_id, planData);

    // For simplicity, we'll update places and schedules by recreating them
    // In a production app, you might want more sophisticated update logic
    const dayPlacesData = dayPlaces.map(place => ({
      ngay: place.day.toString(),
      location: {
        name: place.name,
        description: place.description,
        lat: place.lat || 0,
        lon: place.lon || 0
      },
      schedules: place.schedules.map(schedule => ({
        name: schedule.name,
        description: schedule.description,
        start_time: schedule.startTime ? new Date(`2024-01-01T${schedule.startTime}:00`) : undefined,
        end_time: schedule.endTime ? new Date(`2024-01-01T${schedule.endTime}:00`) : undefined,
        location: {
          name: schedule.location,
          description: schedule.description,
          lat: schedule.lat || 0,
          lon: schedule.lon || 0
        }
      }))
    }));

    await planService.updatePlanPlaces(initialPlan.plan_id, dayPlacesData);

    toast.success('Kế hoạch đã được cập nhật thành công!');

    if (onSave) {
      onSave(initialPlan.plan_id);
    } else {
      onBack();
    }
  };

  // Get places for current day
  const currentDayPlaces = dayPlaces.filter(place => place.day === currentDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-muted-foreground">Đang tải dữ liệu kế hoạch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <Button onClick={handleSave} disabled={saving || loading} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang lưu...') : (mode === 'edit' ? 'Cập nhật kế hoạch' : 'Lưu kế hoạch')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Nhập thông tin chung về kế hoạch du lịch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Tên kế hoạch *</Label>
                <Input
                  id="plan-name"
                  placeholder="Ví dụ: Du lịch Đà Nẵng 3 ngày"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-description">Mô tả</Label>
                <Textarea
                  id="plan-description"
                  placeholder="Mô tả ngắn về kế hoạch..."
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-location">Địa điểm chính *</Label>
                <Input
                  id="plan-location"
                  placeholder="Ví dụ: Đà Nẵng"
                  value={planLocation}
                  onChange={(e) => setPlanLocation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="days">Số ngày</Label>
                  <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {day} ngày
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={status} onValueChange={(value: 'public' | 'private') => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Riêng tư</SelectItem>
                      <SelectItem value="public">Công khai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL hình ảnh</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Thêm tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lịch trình chi tiết</CardTitle>
              <CardDescription>
                Tạo lịch trình theo từng ngày và địa điểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={currentDay.toString()} onValueChange={(value) => setCurrentDay(parseInt(value))}>
                <TabsList className="grid grid-cols-auto mb-6" style={{ gridTemplateColumns: `repeat(${Math.min(days, 7)}, 1fr)` }}>
                  {Array.from({ length: days }, (_, i) => i + 1).map(day => (
                    <TabsTrigger key={day} value={day.toString()}>
                      Ngày {day}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Array.from({ length: days }, (_, i) => i + 1).map(day => (
                  <TabsContent key={day} value={day.toString()} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Ngày {day}</h3>
                      <Button onClick={handleAddDayPlace} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa điểm
                      </Button>
                    </div>

                    {currentDayPlaces.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Chưa có địa điểm nào cho ngày này</p>
                        <Button onClick={handleAddDayPlace} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm địa điểm đầu tiên
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentDayPlaces.map((place, placeIndex) => (
                          <Card key={place.id} className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    placeholder="Tên địa điểm..."
                                    value={place.name}
                                    onChange={(e) => handleUpdateDayPlace(place.id, { name: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Mô tả địa điểm..."
                                    value={place.description}
                                    onChange={(e) => handleUpdateDayPlace(place.id, { description: e.target.value })}
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDayPlace(place.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm font-medium">Lịch trình</Label>
                                  <Button
                                    onClick={() => handleAddSchedule(place.id)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Thêm
                                  </Button>
                                </div>

                                {place.schedules.map((schedule) => (
                                  <div key={schedule.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <Input
                                        placeholder="Tên hoạt động..."
                                        value={schedule.name}
                                        onChange={(e) => handleUpdateSchedule(place.id, schedule.id, { name: e.target.value })}
                                      />
                                      <Input
                                        placeholder="Địa điểm cụ thể..."
                                        value={schedule.location}
                                        onChange={(e) => handleUpdateSchedule(place.id, schedule.id, { location: e.target.value })}
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <Input
                                          type="time"
                                          placeholder="Giờ bắt đầu"
                                          value={schedule.startTime}
                                          onChange={(e) => handleUpdateSchedule(place.id, schedule.id, { startTime: e.target.value })}
                                        />
                                        <Input
                                          type="time"
                                          placeholder="Giờ kết thúc"
                                          value={schedule.endTime}
                                          onChange={(e) => handleUpdateSchedule(place.id, schedule.id, { endTime: e.target.value })}
                                        />
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <Input
                                          placeholder="Mô tả..."
                                          value={schedule.description}
                                          onChange={(e) => handleUpdateSchedule(place.id, schedule.id, { description: e.target.value })}
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveSchedule(place.id, schedule.id)}
                                          className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
