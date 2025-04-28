'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, MapPin, Tag, ArrowLeft, Save, Plus, Trash2, Clock, Users, Check, UserPlus } from 'lucide-react';
import { TravelPlanTemplate, Day, Activity } from './mock-data';
import { TripGroup, getUserGroups } from './trip-groups-data';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';

interface CreatePlanPageProps {
  onBack: () => void;
  onSave: (template: TravelPlanTemplate) => void;
  onApplyToGroup?: (template: TravelPlanTemplate, groupId: string) => void;
}

export function CreatePlanPage({ onBack, onSave, onApplyToGroup }: CreatePlanPageProps) {
  // Get current user from Clerk
  const { user } = useUser();

  // State for plan details
  const [planName, setPlanName] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(1);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // State for activities
  const [days, setDays] = useState<Day[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{activity: Activity, dayIndex: number} | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: '08:00',
    title: '',
    description: '',
    location: ''
  });

  // State for apply to group
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [userGroups, setUserGroups] = useState<TripGroup[]>(getUserGroups());
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [applyAfterSave, setApplyAfterSave] = useState(false);

  // Load user groups
  useEffect(() => {
    setUserGroups(getUserGroups());
  }, []);

  // Update days when duration changes
  useEffect(() => {
    const updatedDays = [...days];

    // If duration increased, add new days
    if (duration > updatedDays.length) {
      for (let i = updatedDays.length; i < duration; i++) {
        updatedDays.push({
          id: `day-${i+1}`,
          date: null,
          activities: []
        });
      }
    }
    // If duration decreased, remove days
    else if (duration < updatedDays.length) {
      updatedDays.splice(duration);
    }

    setDays(updatedDays);

    // Adjust current day index if needed
    if (currentDayIndex >= duration) {
      setCurrentDayIndex(duration - 1);
    }
  }, [duration, days, currentDayIndex]);

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
    setShowAddTag(false);
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle adding a new activity
  const handleAddActivity = (dayIndex: number) => {
    setEditingActivity(null);
    setNewActivity({
      time: '08:00',
      title: '',
      description: '',
      location: ''
    });
    setCurrentDayIndex(dayIndex);
    setShowActivityDialog(true);
  };

  // Handle editing an activity
  const handleEditActivity = (activity: Activity, dayIndex: number) => {
    setEditingActivity({ activity, dayIndex });
    setNewActivity({
      time: activity.time,
      title: activity.title,
      description: activity.description,
      location: activity.location
    });
    setShowActivityDialog(true);
  };

  // Handle deleting an activity
  const handleDeleteActivity = (activityId: string, dayIndex: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
      const updatedDays = [...days];
      updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
        activity => activity.id !== activityId
      );
      setDays(updatedDays);
    }
  };

  // Handle saving an activity
  const handleSaveActivity = () => {
    if (!newActivity.title || !newActivity.time || !newActivity.location) {
      alert('Vui lòng điền đầy đủ thông tin hoạt động.');
      return;
    }

    const updatedDays = [...days];

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
          location: newActivity.location!
        };
      }
    } else {
      // Add new activity
      const newActivityObj: Activity = {
        id: uuidv4(),
        title: newActivity.title!,
        time: newActivity.time!,
        description: newActivity.description || '',
        location: newActivity.location!,
        mainLocation: newActivity.location! // Set mainLocation to the same as location
      };

      updatedDays[currentDayIndex].activities.push(newActivityObj);
    }

    // Sort activities by time
    updatedDays.forEach(day => {
      day.activities.sort((a, b) => a.time.localeCompare(b.time));
    });

    setDays(updatedDays);
    setShowActivityDialog(false);
  };

  // Handle saving the plan
  const handleSavePlan = () => {
    if (!planName || !destination || duration < 1) {
      alert('Vui lòng điền đầy đủ thông tin kế hoạch (tên, địa điểm, thời gian).');
      return;
    }

    // Check if any day has activities
    const hasActivities = days.some(day => day.activities.length > 0);
    if (!hasActivities) {
      alert('Vui lòng thêm ít nhất một hoạt động cho kế hoạch.');
      return;
    }

    // Create new template
    const newTemplate: TravelPlanTemplate = {
      id: uuidv4(),
      name: planName,
      destination,
      region: determineRegion(destination),
      description,
      duration,
      image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=600', // Default image
      tags,
      days,
      authorId: user?.id || '1', // Use Clerk user ID or fallback to mock ID
      authorName: user?.fullName || user?.username || 'Người dùng', // Use Clerk user name or fallback
      isPublic,
      rating: 0,
      usageCount: 0
    };

    // Save the template
    onSave(newTemplate);

    if (applyAfterSave && selectedGroupId && onApplyToGroup) {
      // Apply to selected group
      onApplyToGroup(newTemplate, selectedGroupId);
      alert(`Đã lưu kế hoạch và áp dụng cho nhóm thành công!`);
    } else {
      alert('Đã lưu kế hoạch thành công!');
    }

    onBack();
  };

  // Handle apply to group
  const handleApplyToGroup = () => {
    if (!selectedGroupId) {
      alert('Vui lòng chọn một nhóm để áp dụng kế hoạch.');
      return;
    }

    setApplyAfterSave(true);
    setShowApplyDialog(false);

    // Thông báo cho người dùng biết
    const selectedGroup = userGroups.find(group => group.id === selectedGroupId);
    alert(`Kế hoạch sẽ được áp dụng cho nhóm "${selectedGroup?.title}" sau khi lưu.`);
  };

  // Helper function to determine region based on destination
  const determineRegion = (dest: string): 'Miền Bắc' | 'Miền Trung' | 'Miền Nam' => {
    const northCities = ['hà nội', 'hạ long', 'sapa', 'ninh bình', 'hải phòng', 'cao bằng', 'lào cai'];
    const centralCities = ['đà nẵng', 'huế', 'hội an', 'nha trang', 'đà lạt', 'quy nhơn', 'phú yên'];
    // Danh sách các thành phố miền Nam
    const lowerDest = dest.toLowerCase();

    if (northCities.some(city => lowerDest.includes(city))) {
      return 'Miền Bắc';
    } else if (centralCities.some(city => lowerDest.includes(city))) {
      return 'Miền Trung';
    } else {
      return 'Miền Nam';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowApplyDialog(true)}
            size="sm"
            className={applyAfterSave ? "bg-green-50 border-green-200 text-green-700" : ""}
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            {applyAfterSave ? (
              <span className="flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Áp dụng cho nhóm
              </span>
            ) : (
              "Áp dụng cho nhóm"
            )}
          </Button>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSavePlan} size="sm">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Lưu kế hoạch
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base">Thông tin kế hoạch</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="plan-name" className="text-sm">Tên kế hoạch</Label>
            <Input
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Nhập tên kế hoạch"
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="destination" className="text-sm">Địa điểm</Label>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-purple-500 mr-2" />
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Nhập địa điểm"
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="duration" className="text-sm">Thời gian (ngày)</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={30}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả kế hoạch"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-500" />
              Thẻ
            </Label>
            <div className="flex flex-wrap gap-1.5 min-h-9 items-center border rounded-md p-1.5">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs flex items-center gap-1"
                >
                  #{tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-purple-200/80"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {showAddTag ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Thêm thẻ"
                    className="h-7 text-xs min-w-[100px] max-w-[150px]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTag();
                      } else if (e.key === 'Escape') {
                        setShowAddTag(false);
                        setNewTag('');
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleAddTag}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowAddTag(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Thêm thẻ
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="public-switch" className="text-sm flex items-center gap-2 cursor-pointer">
              Công khai mẫu kế hoạch
              <span className="text-xs text-muted-foreground">(Mọi người có thể xem và sử dụng)</span>
            </Label>
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Lịch trình chi tiết</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          {days.length > 0 ? (
            <Tabs
              defaultValue={`day-0`}
              value={`day-${currentDayIndex}`}
              onValueChange={(value) => setCurrentDayIndex(parseInt(value.split('-')[1]))}
              className="w-full"
            >
              <TabsList className={`grid mb-3`} style={{ gridTemplateColumns: `repeat(${Math.min(days.length, 7)}, 1fr)` }}>
                {days.map((day, index) => (
                  <TabsTrigger key={day.id} value={`day-${index}`} className="text-xs py-1">
                    Ngày {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map((day, dayIndex) => (
                <TabsContent key={day.id} value={`day-${dayIndex}`} className="space-y-3">
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleAddActivity(dayIndex)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Thêm hoạt động
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {day.activities.map((activity) => (
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

                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditActivity(activity, dayIndex)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Vui lòng nhập số ngày để tạo lịch trình</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa hoạt động */}
      <Dialog
        open={showActivityDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowActivityDialog(false);
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
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-purple-500 mr-2" />
                <Input
                  id="activity-time"
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
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
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-purple-500 mr-2" />
                <Input
                  id="activity-location"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                  placeholder="Nhập địa điểm"
                  className="h-8 text-sm"
                />
              </div>
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
              onClick={() => setShowActivityDialog(false)}
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

      {/* Dialog chọn nhóm để áp dụng */}
      <Dialog
        open={showApplyDialog}
        onOpenChange={setShowApplyDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Áp dụng kế hoạch cho nhóm
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="text-sm mb-4">Chọn nhóm bạn muốn áp dụng kế hoạch này:</p>

            {userGroups.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {userGroups.map(group => (
                  <div
                    key={group.id}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedGroupId === group.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/10'
                    }`}
                    onClick={() => setSelectedGroupId(group.id)}
                  >
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line */}
                      <img
                        src={group.image}
                        alt={group.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{group.title}</h3>
                      <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{group.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{group.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{group.members.count} thành viên</span>
                        </div>
                      </div>

                      {group.hasPlan && (
                        <Badge variant="outline" className="mt-2 text-xs bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
                          Đã có kế hoạch
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Bạn chưa tham gia nhóm nào</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Tạo nhóm mới
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowApplyDialog(false);
                if (applyAfterSave) {
                  setApplyAfterSave(false);
                  setSelectedGroupId(null);
                }
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
              onClick={handleApplyToGroup}
              disabled={!selectedGroupId}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
