'use client';

import { useState, useEffect, useCallback } from 'react';
import { TripPlan, Activity } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Star, Users, ArrowLeft, Edit, Save, Plus, Trash2, Share, Heart, Clock } from 'lucide-react';
import { InteractiveScheduleChart } from '../planning/InteractiveScheduleChart';
import { TripPlanProvider, useTripPlan } from './context/TripPlanContext';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { toast } from 'sonner';

interface TripPlanEditorProps {
  plan: TripPlan;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (plan: TripPlan) => Promise<void>;
}

export default function TripPlanEditor({
  plan: initialPlan,
  isOpen,
  onClose,
  onSave
}: TripPlanEditorProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen);

  // Cập nhật trạng thái mở khi prop isOpen thay đổi
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  // Xử lý đóng dialog
  const handleCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog
      open={internalOpen}
      onOpenChange={(open) => {
        if (open === false) {
          // Khi dialog được đóng từ bên ngoài (nhấn Escape hoặc nhấn bên ngoài)
          handleCloseDialog();
        }
        setInternalOpen(open);
      }}
    >
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] max-h-[95vh] overflow-auto p-0">
        <TripPlanProvider initialPlan={initialPlan} onSave={onSave}>
          <TripPlanEditorContent onClose={handleCloseDialog} />
        </TripPlanProvider>
      </DialogContent>
    </Dialog>
  );
}

function TripPlanEditorContent({ onClose }: { onClose: () => void }) {
  const {
    plan,
    isEditing,
    setIsEditing,
    saveState,
    lastSaved,
    saveError,
    updatePlan,
    updateActivities,
    savePlan,
    revertChanges,
    hasUnsavedChanges
  } = useTripPlan();

  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  // Xử lý đóng dialog
  const handleClose = () => {
    if (isEditing && hasUnsavedChanges) {
      setIsClosing(true);
      setShowUnsavedChangesDialog(true);
    } else {
      onClose();
    }
  };

  const [editingActivity, setEditingActivity] = useState<{ activity: Activity; dayIndex: number } | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState<{ dayIndex: number } | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: '12:00',
    title: '',
    description: '',
    location: ''
  });

  // Unsaved changes warning
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      const message = 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi?';
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

  // Bắt đầu chỉnh sửa
  const handleStartEditing = () => {
    setIsEditing(true);
  };

  // Xử lý khi người dùng muốn thoát khỏi chế độ chỉnh sửa
  const handleExitEditMode = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  // Xử lý khi người dùng nhấn nút X hoặc nhấn bên ngoài dialog
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing && hasUnsavedChanges) {
        e.preventDefault();
        setIsClosing(true);
        setShowUnsavedChangesDialog(true);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isEditing, hasUnsavedChanges]);

  // Hủy chỉnh sửa
  const handleCancelEditing = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      revertChanges();
      setIsEditing(false);
    }
  };

  // Lưu thay đổi
  const handleSaveChanges = async () => {
    await savePlan();
    setIsEditing(false);
    toast.success('Đã lưu thay đổi');
  };

  // Cập nhật thông tin cơ bản
  const handleBasicInfoChange = (field: keyof TripPlan, value: any) => {
    updatePlan({ [field]: value });
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
    if (!plan) return;

    // Validate
    if (!newActivity.title || !newActivity.time || !newActivity.location) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const updatedDays = [...plan.days];

    if (editingActivity) {
      // Update existing activity
      const { dayIndex, activity } = editingActivity;
      const activityIndex = updatedDays[dayIndex].activities.findIndex(a => a.id === activity.id);

      if (activityIndex !== -1) {
        updatedDays[dayIndex].activities[activityIndex] = {
          ...activity,
          title: newActivity.title!,
          time: newActivity.time!,
          description: newActivity.description || '',
          location: newActivity.location!,
          mainLocation: newActivity.location!
        };
      }
    } else if (isAddingActivity) {
      // Add new activity
      const newActivityObj: Activity = {
        id: `activity-${Date.now()}`,
        title: newActivity.title!,
        time: newActivity.time!,
        description: newActivity.description || '',
        location: newActivity.location!,
        mainLocation: newActivity.location!
      };

      updatedDays[isAddingActivity.dayIndex].activities.push(newActivityObj);
    }

    // Update the plan with the new days
    updatePlan({
      days: updatedDays
    });

    setEditingActivity(null);
    setIsAddingActivity(null);

    toast.success(editingActivity ? 'Đã cập nhật hoạt động' : 'Đã thêm hoạt động mới');
  };

  // Xóa hoạt động
  const handleDeleteActivity = (activityId: string, dayIndex: number) => {
    if (!plan) return;

    const updatedDays = [...plan.days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (activity: Activity) => activity.id !== activityId
    );

    // Update the plan with the new days
    updatePlan({
      days: updatedDays
    });

    toast.success('Đã xóa hoạt động');
  };

  if (!plan) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="text-sm text-muted-foreground">{plan.destination}</p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <AutoSaveIndicator
              state={saveState}
              lastSaved={lastSaved}
              error={saveError}
              onRetry={savePlan}
            />
          )}

          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEditing}
                size="sm"
              >
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

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="info" className="text-sm py-2">Thông tin chuyến đi</TabsTrigger>
            <TabsTrigger value="schedule" className="text-sm py-2">Lịch trình chi tiết</TabsTrigger>
            <TabsTrigger value="chart" className="text-sm py-2">Biểu đồ</TabsTrigger>
          </TabsList>

          {/* Tab 1: Thông tin chuyến đi */}
          <TabsContent value="info" className="space-y-4 pt-3">
            <Card className="shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Mô tả</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {isEditing ? (
                  <Textarea
                    value={plan.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Thẻ</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="flex flex-wrap gap-1.5">
                  {plan.tags.map((tag: string) => (
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

          {/* Tab 2: Lịch trình chi tiết */}
          <TabsContent value="schedule" className="pt-3">
            <Card className="shadow-sm">
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
                    {plan.days.map((day: any, index: number) => (
                      <TabsTrigger key={day.id} value={`day-${index}`} className="text-xs py-1">
                        Ngày {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {plan.days.map((day: any, dayIndex: number) => (
                    <TabsContent key={day.id} value={`day-${dayIndex}`} className="space-y-3">
                      <div className="space-y-3">
                        {day.activities.map((activity: Activity) => (
                          <div
                            key={activity.id}
                            className="border border-purple-100 dark:border-purple-900 rounded-md p-3 space-y-2 shadow-sm"
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
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleEditActivity(activity, dayIndex)}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-red-500"
                                    onClick={() => handleDeleteActivity(activity.id, dayIndex)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.location}</span>
                            </div>
                            {activity.description && (
                              <p className="text-xs text-muted-foreground">{activity.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Biểu đồ */}
          <TabsContent value="chart" className="pt-3">
            <Card className="shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Biểu đồ lịch trình</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-2 md:px-4">
                <div className="relative min-h-[500px] md:min-h-[600px]">
                  <InteractiveScheduleChart
                    days={plan.days}
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
                        onRetry={savePlan}
                        className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog xác nhận khi có thay đổi chưa lưu */}
      <Dialog
        open={showUnsavedChangesDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowUnsavedChangesDialog(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Thay đổi chưa lưu</DialogTitle>
          </DialogHeader>

          <div className="py-3">
            <p className="text-sm text-muted-foreground">
              Bạn có thay đổi chưa lưu. Bạn có muốn lưu thay đổi trước khi thoát?
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                revertChanges();
                setIsEditing(false);
                setShowUnsavedChangesDialog(false);

                if (isClosing) {
                  onClose();
                }

                setIsClosing(false);
                toast.info('Đã hủy các thay đổi');
              }}
            >
              Không lưu
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
              onClick={async () => {
                await savePlan();
                setIsEditing(false);
                setShowUnsavedChangesDialog(false);

                if (isClosing) {
                  onClose();
                }

                setIsClosing(false);
                toast.success('Đã lưu thay đổi');
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="activity-time">Thời gian</Label>
              <Input
                id="activity-time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activity-title">Tên hoạt động</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activity-location">Địa điểm</Label>
              <Input
                id="activity-location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activity-description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                className="min-h-[80px]"
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
    </div>
  );
}
