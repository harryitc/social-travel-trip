'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Calendar, Clock, MapPin, Star, Users, Info, Copy, Search, UserPlus, UsersRound, PlusIcon, Globe, Lock, User } from 'lucide-react';
import { ScheduleChart } from './ScheduleChart';
import { TRAVEL_PLAN_TEMPLATES, TravelPlanTemplate } from './mock-data';
import { Checkbox } from '@/components/ui/radix-ui/checkbox';
import { SelectTripGroup } from './select-trip-group';
import { TripGroup } from './trip-groups-data';
import EditableTemplateDetailsPageNew from './EditableTemplateDetailsPageNew';
import { CreatePlanPage } from './CreatePlanPage';
import * as mockDB from './mock-database';

export function TravelTemplates() {
  // We don't need to keep templates in state since we're using the mock database
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TravelPlanTemplate | null>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showSelectGroupDialog, setShowSelectGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);
  const [applyMethod, setApplyMethod] = useState<'new' | 'existing'>('new');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize templates from mock database
  useEffect(() => {
    // Initialize the mock database with our default templates
    mockDB.initializeTemplates(TRAVEL_PLAN_TEMPLATES);

    // Set loading to false after initialization
    setIsLoading(false);
  }, []);

  // Mock user data for demonstration
  const mockUsers = [
    { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '2', name: 'Trần Thu Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '4', name: 'Ngọc Mai', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '5', name: 'Phạm Tuấn', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  ];

  // Use the mock database search function
  const filteredTemplates = mockDB.searchTemplates(searchQuery, selectedRegion);

  const handleViewDetails = (template: TravelPlanTemplate) => {
    setSelectedTemplate(template);
    // Go directly to the details page instead of showing the popup
  };

  // Xử lý khi nhấn nút "Áp dụng"
  const handleApplyTemplate = (template: TravelPlanTemplate) => {
    setSelectedTemplate(template);
    setShowSelectGroupDialog(true);
  };

  const handleSelectGroup = (group: TripGroup) => {
    setSelectedGroup(group);
    setApplyMethod('existing');
  };

  const handleToggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleApplyToGroup = () => {
    if (applyMethod === 'new') {
      // Apply to new group
      console.log('Applying template to new group:', {
        templateId: selectedTemplate?.id,
        groupName,
        members: selectedMembers
      });

      // Hiển thị thông báo thành công
      alert(`Đã tạo nhóm "${groupName}" và áp dụng mẫu kế hoạch thành công!`);
    } else if (applyMethod === 'existing' && selectedGroup) {
      // Apply to existing group
      console.log('Applying template to existing group:', {
        templateId: selectedTemplate?.id,
        groupId: selectedGroup.id,
        groupName: selectedGroup.title
      });

      // Hiển thị thông báo thành công
      alert(`Đã áp dụng mẫu kế hoạch cho nhóm "${selectedGroup.title}" thành công!`);
    }

    // Close dialog and reset form
    setShowApplyDialog(false);
    setShowSelectGroupDialog(false);
    setGroupName('');
    setSelectedMembers([]);
    setSelectedGroup(null);

    // Quay lại tab mẫu kế hoạch (danh sách các mẫu)
    setSelectedTemplate(null);
  };

  // Thêm hàm xử lý lưu mẫu kế hoạch mới
  const handleSaveNewTemplate = (newTemplate: TravelPlanTemplate) => {
    // Add the template to the mock database
    mockDB.addTemplate(newTemplate);

    // Force a re-render by setting loading to true briefly
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Hàm xử lý áp dụng mẫu kế hoạch cho nhóm
  const handleApplyTemplateToGroup = (template: TravelPlanTemplate, groupId: string) => {
    console.log('Áp dụng mẫu kế hoạch cho nhóm:', {
      templateId: template.id,
      templateName: template.name,
      groupId: groupId
    });

    // Increment the usage count in the mock database
    mockDB.incrementUsageCount(template.id);

    // Force a re-render by setting loading to true briefly
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);

    // Trong thực tế, đây là nơi bạn sẽ gọi API để áp dụng mẫu kế hoạch cho nhóm
  };

  // Nếu đang ở trang tạo kế hoạch mới
  if (showCreatePlan) {
    return (
      <CreatePlanPage
        onBack={() => setShowCreatePlan(false)}
        onSave={handleSaveNewTemplate}
        onApplyToGroup={handleApplyTemplateToGroup}
      />
    );
  }

  // Nếu đã chọn một mẫu, hiển thị trang chi tiết
  if (selectedTemplate && !showApplyDialog && !showSelectGroupDialog) {
    return (
      <EditableTemplateDetailsPageNew
        template={selectedTemplate}
        onBack={() => setSelectedTemplate(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
        <CardHeader>
          <CardTitle>Mẫu kế hoạch du lịch</CardTitle>
          <CardDescription>
            Khám phá và sử dụng các mẫu kế hoạch du lịch cho các điểm đến nổi tiếng tại Việt Nam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grow">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm mẫu kế hoạch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khu vực</SelectItem>
                  <SelectItem value="Miền Bắc">Miền Bắc</SelectItem>
                  <SelectItem value="Miền Trung">Miền Trung</SelectItem>
                  <SelectItem value="Miền Nam">Miền Nam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setShowCreatePlan(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Tạo kế hoạch mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent animate-spin"></div>
            <p className="text-muted-foreground">Đang tải mẫu kế hoạch...</p>
          </div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không tìm thấy mẫu kế hoạch nào phù hợp</h3>
          <p className="text-muted-foreground mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => (
          <Card key={template.id} className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            <div className="relative h-40">
              {/* eslint-disable-next-line */}
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                {template.isPublic ? (
                  <Badge className="bg-green-500 flex items-center gap-0.5 text-[9px] h-5 px-1.5">
                    <Globe className="h-2.5 w-2.5" />
                    Công khai
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-0.5 text-[9px] h-5 px-1.5">
                    <Lock className="h-2.5 w-2.5" />
                    Riêng tư
                  </Badge>
                )}
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                <h3 className="text-white font-semibold text-sm line-clamp-1">{template.name}</h3>
                <div className="flex items-center text-white/90 text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{template.destination}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{template.rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({template.usageCount})
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{template.duration} ngày</span>
                </div>
              </div>

              {template.authorName && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  <span className="truncate">Tác giả: {template.authorName}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mt-1">
                {template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[9px] px-1.5 py-0">
                    #{tag}
                  </Badge>
                ))}
                {template.tags.length > 2 && (
                  <Badge variant="outline" className="bg-purple-100/50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[9px] px-1.5 py-0">
                    +{template.tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-3 bg-white/90 hover:bg-white"
                onClick={() => handleViewDetails(template)}
              >
                <Info className="h-3.5 w-3.5 mr-1.5" />
                Chi tiết
              </Button>
              <Button
                size="sm"
                className="h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3"
                onClick={() => handleApplyTemplate(template)}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Áp dụng
              </Button>
            </div>
          </Card>
          ))}
        </div>
      )}

      {/* Template Details Dialog - Only shown when explicitly opened, not when clicking "Chi tiết" */}
      {selectedTemplate && showTemplateDetails && (
        <Dialog open={showTemplateDetails} onOpenChange={setShowTemplateDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTemplate.destination}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTemplate.duration} ngày</span>
                  {selectedTemplate.isPublic ? (
                    <Badge className="ml-2 bg-green-500 flex items-center gap-1 text-xs">
                      <Globe className="h-3 w-3" />
                      Công khai
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-2 flex items-center gap-1 text-xs">
                      <Lock className="h-3 w-3" />
                      Riêng tư
                    </Badge>
                  )}
                </div>
                {selectedTemplate.authorName && (
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Tác giả: {selectedTemplate.authorName}</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              <div className="aspect-video rounded-lg overflow-hidden">
                {/* eslint-disable-next-line */}
                <img
                  src={selectedTemplate.image}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Mô tả</h3>
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Lịch trình chi tiết</h3>
                <Tabs defaultValue="schedule" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="schedule">Lịch trình chi tiết</TabsTrigger>
                    <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="schedule" className="space-y-4">
                    <Tabs defaultValue={selectedTemplate.days[0].id} className="w-full">
                      <TabsList className="grid grid-cols-3 mb-4">
                        {selectedTemplate.days.map((day, index) => (
                          <TabsTrigger key={day.id} value={day.id}>
                            Ngày {index + 1}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {selectedTemplate.days.map((day, dayIndex) => (
                        <TabsContent key={day.id} value={day.id} className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Ngày {dayIndex + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {day.activities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="border border-purple-100 dark:border-purple-900 rounded-lg p-3 space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-purple-600 dark:text-purple-400 w-16">
                                          {activity.time}
                                        </span>
                                        <span className="font-medium">{activity.title}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      <div className="flex items-start gap-2 mb-1">
                                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>{activity.location}</span>
                                      </div>
                                      <p className="pl-6">{activity.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="chart">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Biểu đồ lịch trình</CardTitle>
                        <CardDescription>
                          Xem tổng quan lịch trình theo thời gian và địa điểm
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScheduleChart days={selectedTemplate.days} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTemplateDetails(false);
                    setShowSelectGroupDialog(true);
                  }}
                >
                  <UsersRound className="h-4 w-4 mr-2" />
                  Áp dụng cho nhóm đã có
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    setShowTemplateDetails(false);
                    setApplyMethod('new');
                    setShowApplyDialog(true);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Tạo nhóm mới
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Apply Template Dialog */}
      {selectedTemplate && (
        <Dialog
          open={showApplyDialog}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              // Đóng dialog áp dụng
              setShowApplyDialog(false);
              // Reset các state liên quan
              if (applyMethod === 'new') {
                setGroupName('');
                setSelectedMembers([]);
              }
              // Quay lại tab mẫu kế hoạch (danh sách các mẫu)
              setSelectedTemplate(null);
            } else {
              setShowApplyDialog(isOpen);
            }
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{applyMethod === 'new' ? 'Tạo nhóm mới' : 'Áp dụng cho nhóm đã có'}</DialogTitle>
              <DialogDescription>
                Áp dụng mẫu &quot;{selectedTemplate.name}&quot; {applyMethod === 'new' ? 'cho nhóm mới' : `cho nhóm ${selectedGroup?.title || ''}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {applyMethod === 'existing' && selectedGroup ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="h-16 w-16 rounded-md overflow-hidden shrink-0">
                      {/* eslint-disable-next-line */}
                      <img
                        src={selectedGroup.image}
                        alt={selectedGroup.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-base">{selectedGroup.title}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{selectedGroup.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{selectedGroup.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span>{selectedGroup.members.count}/{selectedGroup.members.max} thành viên</span>
                          </div>
                        </div>
                      </div>

                      {selectedGroup.hasPlan && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
                            Đã có kế hoạch
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowApplyDialog(false);
                      setShowSelectGroupDialog(true);
                    }}
                  >
                    <UsersRound className="h-4 w-4 mr-2" />
                    Chọn nhóm khác
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}

              <div className="space-y-2">
                <Label>Tùy chỉnh</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="customize" />
                  <Label
                    htmlFor="customize"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tùy chỉnh lịch trình sau khi áp dụng
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                // Đóng dialog áp dụng
                setShowApplyDialog(false);
                // Reset các state liên quan
                if (applyMethod === 'new') {
                  setGroupName('');
                  setSelectedMembers([]);
                }
                // Quay lại tab mẫu kế hoạch (danh sách các mẫu)
                setSelectedTemplate(null);
              }}>
                Hủy
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleApplyToGroup}
                disabled={applyMethod === 'new' ? (!groupName || selectedMembers.length === 0) : !selectedGroup}
              >
                {applyMethod === 'new' ? 'Tạo nhóm' : 'Áp dụng'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Select Existing Group Dialog */}
      {selectedTemplate && (
        <SelectTripGroup
          open={showSelectGroupDialog}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              // Đóng dialog chọn nhóm
              setShowSelectGroupDialog(false);
              // Quay lại tab mẫu kế hoạch (danh sách các mẫu)
              setSelectedTemplate(null);
            } else {
              setShowSelectGroupDialog(isOpen);
            }
          }}
          onSelectGroup={(group) => {
            handleSelectGroup(group);
            setShowSelectGroupDialog(false);
            setShowApplyDialog(true);
          }}
          onCreateNewGroup={() => {
            setShowSelectGroupDialog(false);
            setApplyMethod('new');
            setShowApplyDialog(true);
          }}
          templateName={selectedTemplate.name}
        />
      )}


    </div>
  );
}


