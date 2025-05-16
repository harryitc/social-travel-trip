'use client';

import { useState, useEffect, useCallback } from 'react';
import { TravelPlanTemplate, Activity } from './mock-data';
import { Button } from '@/components/ui/radix-ui/button';
import {
  ArrowLeft, Edit, Save, Plus, MapPin, Calendar,
  Users, Share, Heart, Clock, Star, Trash2, Lock, Globe
} from 'lucide-react';
import TripPlanEditor from '../trips/TripPlanEditor';
import { templateToTripPlan, tripPlanToTemplate } from './utils/template-trip-converter';
import { TripPlan } from '../trips/types';
import { toast } from 'sonner';
import { TemplateProvider, useTemplate } from './context/TemplateContext';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { SelectTripGroup } from './select-trip-group';
import { TripGroup } from './trip-groups-data';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/radix-ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/radix-ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/radix-ui/dialog';
import { Label } from '@/components/ui/radix-ui/label';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Badge } from '@/components/ui/radix-ui/badge';
import dynamic from 'next/dynamic';

const InteractiveScheduleChart = dynamic(
  () => import('./InteractiveScheduleChart').then((mod) => mod.InteractiveScheduleChart),
  { ssr: false }
);

interface EditableTemplateDetailsPageProps {
  template: TravelPlanTemplate;
  onBack: () => void;
  onSave?: (template: TravelPlanTemplate) => Promise<void>;
}

export default function EditableTemplateDetailsPage({
  template: initialTemplate,
  onBack
}: EditableTemplateDetailsPageProps) {
  return (
    <TemplateProvider initialTemplate={initialTemplate}>
      <EditableTemplateDetailsContent onBack={onBack} />
    </TemplateProvider>
  );
}

function EditableTemplateDetailsContent({ onBack }: { onBack: () => void }) {
  const {
    template,
    isEditing,
    setIsEditing,
    saveState,
    lastSaved,
    saveError,
    updateTemplate,
    updateActivities,
    saveTemplate,
    revertChanges,
    hasUnsavedChanges
  } = useTemplate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showSelectGroupDialog, setShowSelectGroupDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{ activity: Activity; dayIndex: number } | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState<{ dayIndex: number } | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: '12:00',
    title: '',
    description: '',
    location: ''
  });
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);

  // Unsaved changes warning
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      // Standard way to show a confirmation dialog when leaving the page
      e.preventDefault();
      // For older browsers
      const message = 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi?';
      // @ts-ignore - Deprecated but still needed for some browsers
      e.returnValue = message;
      return message;
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  if (!template) return null;

  // Bắt đầu chỉnh sửa
  const handleStartEditing = () => {
    setIsEditing(true);
    toast.info('Đã bật chế độ chỉnh sửa', {
      description: 'Các thay đổi sẽ được tự động lưu.',
    });
  };

  // Lưu thay đổi
  const handleSaveChanges = async () => {
    try {
      await saveTemplate();
      setIsEditing(false);
      toast.success('Đã lưu thay đổi thành công!');
    } catch (error) {
      toast.error('Lỗi khi lưu thay đổi', {
        description: 'Vui lòng thử lại sau.',
      });
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEditing = () => {
    if (hasUnsavedChanges) {
      if (confirm('Bạn có chắc chắn muốn hủy các thay đổi chưa lưu?')) {
        revertChanges();
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  // Cập nhật thông tin cơ bản
  const handleBasicInfoChange = (field: keyof TravelPlanTemplate, value: any) => {
    updateTemplate({ [field]: value });
  };

  // Mở dialog chỉnh sửa hoạt động
  const handleEditActivity = (activity: Activity, dayIndex: number) => {
    setEditingActivity({ activity, dayIndex });
    setNewActivity({
      time: activity.time,
      title: activity.title,
      description: activity.description,
      location: activity.location
    });
  };

  // Thêm hoạt động mới
  const handleAddActivity = (dayIndex: number) => {
    setIsAddingActivity({ dayIndex });
    setNewActivity({
      time: '12:00',
      title: '',
      description: '',
      location: ''
    });
  };

  // Lưu hoạt động
  const handleSaveActivity = () => {
    if (!newActivity.title || !newActivity.time || !newActivity.location) {
      toast.error("Vui lòng điền đầy đủ thông tin hoạt động.");
      return;
    }

    const updatedDays = [...template.days];

    if (editingActivity) {
      // Cập nhật hoạt động hiện có
      const { dayIndex, activity } = editingActivity;
      const activityIndex = updatedDays[dayIndex].activities.findIndex((a: Activity) => a.id === activity.id);

      if (activityIndex !== -1) {
        updatedDays[dayIndex].activities[activityIndex] = {
          ...activity,
          title: newActivity.title!,
          time: newActivity.time!,
          description: newActivity.description || '',
          location: newActivity.location!
        };
      }
    } else if (isAddingActivity) {
      // Thêm hoạt động mới
      const { dayIndex } = isAddingActivity;
      const newActivityObj: Activity = {
        id: `activity-${Date.now()}`,
        title: newActivity.title!,
        time: newActivity.time!,
        description: newActivity.description || '',
        location: newActivity.location!,
        mainLocation: newActivity.location! // Set mainLocation to the same as location
      };

      updatedDays[dayIndex].activities.push(newActivityObj);

      // Sắp xếp lại các hoạt động theo thời gian
      updatedDays[dayIndex].activities.sort((a: Activity, b: Activity) => a.time.localeCompare(b.time));
    }

    // Update the template with the new days
    updateTemplate({
      days: updatedDays
    });

    setEditingActivity(null);
    setIsAddingActivity(null);

    toast.success(editingActivity ? 'Đã cập nhật hoạt động' : 'Đã thêm hoạt động mới');
  };

  // Xóa hoạt động
  const handleDeleteActivity = (activityId: string, dayIndex: number) => {
    const updatedDays = [...template.days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (activity: Activity) => activity.id !== activityId
    );

    // Update the template with the new days
    updateTemplate({
      days: updatedDays
    });

    toast.success('Đã xóa hoạt động');
  };

  // Áp dụng mẫu cho nhóm
  const handleApplyTemplate = () => {
    setShowApplyDialog(true);
  };

  // Áp dụng mẫu cho nhóm đã chọn
  const handleApplyToGroup = () => {
    if (selectedGroup) {
      alert(`Mẫu "${template.name}" đã được áp dụng cho nhóm "${selectedGroup.title}".`);
      setShowApplyDialog(false);
      setSelectedGroup(null);
    }
  };



  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex items-center gap-2">
          {isEditing && (
            <AutoSaveIndicator
              state={saveState}
              lastSaved={lastSaved}
              error={saveError}
              onRetry={saveTemplate}
            />
          )}

          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEditing} size="sm">
                Hủy
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSaveChanges}
                size="sm"
                disabled={saveState === 'saving'}
              >
                {saveState === 'saving' ? (
                  <>
                    <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleStartEditing} size="sm">
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden shadow-md">
        <div className="h-48 md:h-64">
          {/* eslint-disable-next-line */}
          <img
            src={template.image}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          {isEditing ? (
            <Input
              value={template.name}
              onChange={(e) => handleBasicInfoChange('name', e.target.value)}
              className="text-white text-xl font-bold bg-black/30 border-white/30 mb-2 max-w-md"
            />
          ) : (
            <h1 className="text-white text-xl font-bold mb-2">{template.name}</h1>
          )}

          <div className="flex flex-wrap items-center gap-3 text-white text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {isEditing ? (
                <Input
                  value={template.destination}
                  onChange={(e) => handleBasicInfoChange('destination', e.target.value)}
                  className="text-white bg-black/30 border-white/30 w-32 h-7 text-xs"
                />
              ) : (
                <span>{template.destination}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={template.duration}
                    onChange={(e) => handleBasicInfoChange('duration', parseInt(e.target.value))}
                    className="text-white bg-black/30 border-white/30 w-12 h-7 text-xs"
                  />
                  <span className="text-xs">ngày</span>
                </div>
              ) : (
                <span>{template.duration} ngày</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs">{template.rating} ({template.usageCount} lượt sử dụng)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </Button>
          <Button variant="outline" className="gap-1.5" size="sm">
            <Share className="h-3.5 w-3.5" />
            Chia sẻ
          </Button>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm" onClick={handleApplyTemplate}>
          Áp dụng mẫu
        </Button>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Thông tin chuyến đi</TabsTrigger>
          <TabsTrigger value="schedule">Lịch trình chi tiết</TabsTrigger>
          <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 pt-3">
          <Card className="shadow-xs">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Mô tả</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              {isEditing ? (
                <Textarea
                  value={template.description}
                  onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                  className="min-h-[80px] text-sm"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{template.description}</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">Điểm đến</p>
                    {isEditing ? (
                      <Input
                        value={template.destination}
                        onChange={(e) => handleBasicInfoChange('destination', e.target.value)}
                        className="h-7 text-xs mt-1"
                      />
                    ) : (
                      <p className="text-muted-foreground">{template.destination}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">Thời gian</p>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <Input
                          type="number"
                          value={template.duration}
                          onChange={(e) => handleBasicInfoChange('duration', parseInt(e.target.value))}
                          className="w-16 h-7 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">ngày</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">{template.duration} ngày</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">Tạo bởi</p>
                    <p className="text-muted-foreground">{template.authorName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">Đánh giá</p>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">{template.rating}</span>
                      <span className="text-muted-foreground">({template.usageCount} lượt)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Thẻ</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs">
                    #{tag}
                  </Badge>
                ))}
                {isEditing && (
                  <Badge variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 cursor-pointer text-xs">
                    <Plus className="h-2.5 w-2.5 mr-1" /> Thêm thẻ
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="pt-3">
          <Card className="shadow-xs">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Lịch trình chi tiết</CardTitle>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddActivity(0)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Thêm hoạt động
                </Button>
              )}
            </CardHeader>
            <CardContent className="py-2 px-4">
              <Tabs defaultValue={`day-0`} className="w-full">
                <TabsList className="grid grid-cols-3 mb-3">
                  {template.days.map((day: any, index: number) => (
                    <TabsTrigger key={day.id} value={`day-${index}`} className="text-xs py-1">
                      Ngày {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {template.days.map((day: any, dayIndex: number) => (
                  <TabsContent key={day.id} value={`day-${dayIndex}`} className="space-y-3">
                    <div className="space-y-3">
                      {day.activities.map((activity: Activity) => (
                        <div
                          key={activity.id}
                          className="border border-purple-100 dark:border-purple-900 rounded-md p-3 space-y-2 shadow-xs"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-purple-600 dark:text-purple-400 w-12 text-sm">
                                {activity.time}
                              </span>
                              <span className="font-medium text-sm">{activity.title}</span>
                            </div>

                            {isEditing && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditActivity(activity, dayIndex)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDeleteActivity(activity.id, dayIndex)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground pl-14">
                            {activity.description}
                          </p>

                          <div className="flex items-center text-xs text-muted-foreground pl-14">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      ))}

                      {day.activities.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          {isEditing ? (
                            <div className="space-y-2">
                              <p>Chưa có hoạt động nào cho ngày này</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleAddActivity(dayIndex)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Thêm hoạt động
                              </Button>
                            </div>
                          ) : (
                            <p>Chưa có hoạt động nào cho ngày này</p>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="pt-3">
          <Card className="shadow-xs">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Biểu đồ lịch trình</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="mb-2 text-sm text-muted-foreground">
                <p>Mẹo: Double-click vào hoạt động để xem chi tiết và thực hiện các thao tác.</p>
                <p>Kéo cạnh trái/phải để điều chỉnh thời gian. Kéo thả hoạt động để thay đổi thời gian bắt đầu.</p>
                <p>Giữ phím Ctrl khi kéo để sao chép hoạt động. Nhấn Ctrl+Z để hoàn tác thao tác gần nhất.</p>
              </div>
              <div className="relative">
                <InteractiveScheduleChart
                  days={template.days}
                  isEditing={isEditing}
                  onUpdateActivities={(dayIndex, activities) => {
                    updateActivities(dayIndex, activities);
                  }}
                />

                {isEditing && (
                  <div className="absolute top-2 right-2 z-10">
                    <AutoSaveIndicator
                      state={saveState}
                      lastSaved={lastSaved}
                      error={saveError}
                      onRetry={saveTemplate}
                      className="bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog chỉnh sửa hoạt động */}
      <Dialog
        open={!!editingActivity || !!isAddingActivity}
        onOpenChange={(open) => {
          if (!open) {
            setEditingActivity(null);
            setIsAddingActivity(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingActivity ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="activity-time" className="text-xs">Thời gian</Label>
              <Input
                id="activity-time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-title" className="text-xs">Tên hoạt động</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Nhập tên hoạt động"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-location" className="text-xs">Địa điểm</Label>
              <Input
                id="activity-location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                placeholder="Nhập địa điểm"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-description" className="text-xs">Mô tả</Label>
              <Textarea
                id="activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Nhập mô tả hoạt động"
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingActivity(null);
                setIsAddingActivity(null);
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
              onClick={handleSaveActivity}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog áp dụng mẫu */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Áp dụng mẫu kế hoạch</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="mb-3 text-sm">Chọn nhóm bạn muốn áp dụng mẫu kế hoạch này:</p>

            <Button
              variant="outline"
              className="w-full justify-start h-9 text-sm"
              onClick={() => {
                setShowApplyDialog(false);
                setShowSelectGroupDialog(true);
              }}
            >
              {selectedGroup ? (
                <div className="flex items-center gap-2">
                  <span>{selectedGroup.title}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" />
                  <span>Chọn nhóm</span>
                </div>
              )}
            </Button>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApplyDialog(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
              onClick={handleApplyToGroup}
              disabled={!selectedGroup}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chọn nhóm */}
      {showSelectGroupDialog && (
        <SelectTripGroup
          open={showSelectGroupDialog}
          onOpenChange={setShowSelectGroupDialog}
          onSelectGroup={(group) => {
            setSelectedGroup(group);
            setShowSelectGroupDialog(false);
            setShowApplyDialog(true);
          }}
          templateName={template.name}
        />
      )}
    </div>
  );
}
