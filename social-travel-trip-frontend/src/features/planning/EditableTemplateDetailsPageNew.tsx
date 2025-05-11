'use client';

import { useState, useEffect, useRef } from 'react';
import { TravelPlanTemplate, Activity } from './mock-data';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/radix-ui/dialog';
import { Label } from '@/components/ui/radix-ui/label';
import { Input } from '@/components/ui/radix-ui/input';
import { ArrowLeft, Edit, Save, Plus, MapPin, Calendar, Users, Share } from 'lucide-react';
import { templateToTripPlan, tripPlanToTemplate } from './utils/template-trip-converter';
import { TripPlan } from '../trips/types';
import { toast } from 'sonner';
import { TemplateProvider, useTemplate } from './context/TemplateContext';
import { TripPlanProvider, useTripPlan } from '../trips/context/TripPlanContext';
import { SelectTripGroup } from './select-trip-group';
import { TripGroup } from './trip-groups-data';
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

export default function EditableTemplateDetailsPageNew({
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
    updateTemplate,
    saveTemplate,
  } = useTemplate();

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showSelectGroupDialog, setShowSelectGroupDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);
  // State to track the active tab at the parent level
  const [activeTab, setActiveTab] = useState('chart');

  // Reference to the current plan from TripPlanProvider
  const tripPlanRef = useRef<TripPlan | null>(null);

  // Convert template to trip plan format when template changes
  useEffect(() => {
    if (template) {
      setTripPlan(templateToTripPlan(template));
    }
  }, [template]);

  // Handle saving the trip plan back to template format
  const handleSaveTripPlan = async (updatedPlan: TripPlan) => {
    if (!template) return Promise.reject(new Error('Template not found'));

    try {
      // Convert trip plan back to template format
      const updatedTemplate = tripPlanToTemplate(updatedPlan, template);

      // Update the template in context
      updateTemplate(updatedTemplate);

      // Save the template
      await saveTemplate();

      return Promise.resolve();
    } catch (error) {
      console.error('Error saving trip plan:', error);
      return Promise.reject(error);
    }
  };

  // Handle save button click
  const handleSaveChanges = async () => {
    if (tripPlanRef.current) {
      try {
        await handleSaveTripPlan(tripPlanRef.current);
        setIsEditing(false);
        toast.success('Đã lưu thay đổi thành công!');
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error('Lỗi khi lưu thay đổi');
      }
    } else {
      console.error('Cannot find current trip plan');
      toast.error('Không thể lưu thay đổi');
    }
  };

  // Không cần hàm handleTripPlanChange vì chúng ta đang sử dụng TripPlanProvider

  // State cho dialog tạo nhóm mới
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [applyMethod, setApplyMethod] = useState<'new' | 'existing'>('existing');

  // Mock user data for demonstration
  const mockUsers = [
    { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '2', name: 'Trần Thu Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '4', name: 'Ngọc Mai', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '5', name: 'Phạm Tuấn', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  ];

  // Mở dialog áp dụng mẫu kế hoạch
  const handleApplyTemplate = () => {
    setShowSelectGroupDialog(true);
  };

  // Xử lý khi chọn nhóm
  const handleSelectGroup = (group: TripGroup) => {
    setSelectedGroup(group);
    setShowSelectGroupDialog(false);
    setShowApplyDialog(true);
    setApplyMethod('existing');
  };

  // Xử lý khi chọn tạo nhóm mới
  const handleCreateNewGroup = () => {
    setShowSelectGroupDialog(false);
    setShowCreateGroupDialog(true);
    setApplyMethod('new');
  };

  // Xử lý khi toggle chọn thành viên
  const handleToggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  // Xử lý khi áp dụng mẫu kế hoạch cho nhóm
  const handleApplyToGroup = () => {
    if (applyMethod === 'existing' && selectedGroup && template) {
      // Áp dụng cho nhóm đã có
      toast.success(`Đã áp dụng mẫu "${template.name}" cho nhóm "${selectedGroup.title}"`);
      setShowApplyDialog(false);
      setSelectedGroup(null);
    } else if (applyMethod === 'new' && groupName && selectedMembers.length > 0 && template) {
      // Tạo nhóm mới và áp dụng mẫu
      toast.success(`Đã tạo nhóm "${groupName}" và áp dụng mẫu kế hoạch thành công!`);
      setShowCreateGroupDialog(false);
      setGroupName('');
      setSelectedMembers([]);
    }
  };

  if (!template || !tripPlan) return null;

  // Component to expose the current plan state via a hidden element and ref
  const TripPlanProviderRef = () => {
    const { plan } = useTripPlan();

    // Update the ref whenever the plan changes
    useEffect(() => {
      if (plan) {
        tripPlanRef.current = plan;
      }
    }, [plan]);

    return (
      <div id="trip-plan-provider-ref" data-current-plan={JSON.stringify(plan)} style={{ display: 'none' }} />
    );
  };

  // Create a modified version of TripPlanEditor content
  const TripPlanEditorContent = () => {
    const {
      plan,
      updatePlan,
      updateActivities,
      // savePlan không được sử dụng vì chúng ta đã xử lý lưu ở cấp cao hơn
    } = useTripPlan();

    if (!plan) return null;

    return (
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin chuyến đi</TabsTrigger>
            <TabsTrigger value="schedule">Lịch trình chi tiết</TabsTrigger>
            <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
          </TabsList>

          {/* Tab 1: Thông tin chuyến đi */}
          <TabsContent value="info" className="space-y-4 pt-3">
            <Card className="shadow-xs">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Mô tả</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {isEditing ? (
                  <Textarea
                    value={plan.description}
                    onChange={(e) => updatePlan({ description: e.target.value })}
                    className="min-h-[80px] text-sm"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xs">
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
            <Card className="shadow-xs">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Lịch trình chi tiết</CardTitle>
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
                            className="border border-purple-100 dark:border-purple-900 rounded-md p-3 space-y-2 shadow-xs"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-purple-600 dark:text-purple-400 w-12 text-sm">
                                  {activity.time}
                                </span>
                                <span className="font-medium text-sm">{activity.title}</span>
                              </div>
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
            <Card className="shadow-xs">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{template.name}</h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white"
            onClick={handleApplyTemplate}
          >
            <Share className="h-4 w-4 mr-2" />
            Áp dụng mẫu
          </Button>

          <Button
            className={isEditing
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"}
            onClick={() => {
              if (isEditing) {
                // Khi đang ở chế độ chỉnh sửa và nhấn nút Lưu
                handleSaveChanges();
              } else {
                // Khi không ở chế độ chỉnh sửa và nhấn nút Chỉnh sửa
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden border shadow-xs">
            {/* eslint-disable-next-line */}
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="border rounded-lg p-4 h-full">
            <h3 className="font-medium mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">Điểm đến:</span>
                <span className="font-medium">{template.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">Thời gian:</span>
                <span className="font-medium">{template.duration} ngày</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">Tác giả:</span>
                <span className="font-medium">{template.authorName || 'Không xác định'}</span>
              </div>
              <div className="mt-2">
                <div className="text-sm text-muted-foreground mb-1">Thẻ:</div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TripPlanEditor Content */}
      <TripPlanProvider initialPlan={tripPlan} onSave={handleSaveTripPlan}>
        <TripPlanProviderRef />
        <TripPlanEditorContent />
      </TripPlanProvider>

      {/* Dialog chọn nhóm */}
      <SelectTripGroup
        open={showSelectGroupDialog}
        onOpenChange={setShowSelectGroupDialog}
        onSelectGroup={handleSelectGroup}
        onCreateNewGroup={handleCreateNewGroup}
        templateName={template.name}
      />

      {/* Dialog áp dụng mẫu */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Áp dụng mẫu kế hoạch</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="mb-3 text-sm">Bạn đã chọn nhóm:</p>

            {selectedGroup && (
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="h-10 w-10 rounded-md overflow-hidden">
                  {/* eslint-disable-next-line */}
                  <img
                    src={selectedGroup.image}
                    alt={selectedGroup.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{selectedGroup.title}</h4>
                  <p className="text-xs text-muted-foreground">{selectedGroup.members.count} thành viên</p>
                </div>
              </div>
            )}

            {selectedGroup?.hasPlan && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                <p className="font-medium">Lưu ý:</p>
                <p className="text-xs mt-1">Nhóm này đã có kế hoạch. Nếu áp dụng mẫu mới, kế hoạch cũ sẽ bị ghi đè.</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowApplyDialog(false);
                setSelectedGroup(null);
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleApplyToGroup}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog tạo nhóm mới */}
      <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Tạo nhóm mới</DialogTitle>
            <DialogDescription>
              Áp dụng mẫu &quot;{template.name}&quot; cho nhóm mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Tên nhóm</Label>
              <Input
                id="group-name"
                placeholder="Nhập tên nhóm"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Thành viên</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer border ${
                      selectedMembers.includes(user.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                    onClick={() => handleToggleMember(user.id)}
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                      {/* eslint-disable-next-line */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateGroupDialog(false);
                setGroupName('');
                setSelectedMembers([]);
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleApplyToGroup}
              disabled={!groupName || selectedMembers.length === 0}
            >
              Tạo nhóm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
