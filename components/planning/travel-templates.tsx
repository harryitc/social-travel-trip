'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Star, Users, Info, Copy, Search, UserPlus, UsersRound } from 'lucide-react';
import { TRAVEL_PLAN_TEMPLATES, TravelPlanTemplate, Day, Activity } from './mock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectTripGroup } from './select-trip-group';
import { TripGroup } from './trip-groups-data';
import { Separator } from '@/components/ui/separator';

export function TravelTemplates() {
  const [templates, setTemplates] = useState(TRAVEL_PLAN_TEMPLATES);
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

  // Mock user data for demonstration
  const mockUsers = [
    { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '2', name: 'Trần Thu Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '4', name: 'Ngọc Mai', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
    { id: '5', name: 'Phạm Tuấn', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesRegion = selectedRegion === 'all' || template.region === selectedRegion;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesSearch;
  });

  const handleViewDetails = (template: TravelPlanTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };

  const handleApplyTemplate = (template: TravelPlanTemplate) => {
    setSelectedTemplate(template);
    setApplyMethod('new');
    setShowApplyDialog(true);
  };

  const handleApplyToExistingGroup = (template: TravelPlanTemplate) => {
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
    } else if (applyMethod === 'existing' && selectedGroup) {
      // Apply to existing group
      console.log('Applying template to existing group:', {
        templateId: selectedTemplate?.id,
        groupId: selectedGroup.id,
        groupName: selectedGroup.title
      });
    }

    // Close dialog and reset form
    setShowApplyDialog(false);
    setShowSelectGroupDialog(false);
    setGroupName('');
    setSelectedMembers([]);
    setSelectedGroup(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Mẫu kế hoạch du lịch</CardTitle>
          <CardDescription>
            Khám phá và sử dụng các mẫu kế hoạch du lịch cho các điểm đến nổi tiếng tại Việt Nam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm overflow-hidden">
            <div className="relative h-48">
              {/* eslint-disable-next-line */}
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg">{template.name}</h3>
                <div className="flex items-center text-white/90 text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{template.destination}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{template.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({template.usageCount} lượt sử dụng)
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{template.duration} ngày</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleViewDetails(template)}
              >
                <Info className="h-4 w-4 mr-2" />
                Chi tiết
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleApplyTemplate(template)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Áp dụng
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Template Details Dialog */}
      {selectedTemplate && (
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
                </div>
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
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
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
              </div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTemplateDetails(false);
                    handleApplyToExistingGroup(selectedTemplate);
                  }}
                >
                  <UsersRound className="h-4 w-4 mr-2" />
                  Áp dụng cho nhóm đã có
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    setShowTemplateDetails(false);
                    handleApplyTemplate(selectedTemplate);
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
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{applyMethod === 'new' ? 'Tạo nhóm mới' : 'Áp dụng cho nhóm đã có'}</DialogTitle>
              <DialogDescription>
                Áp dụng mẫu "{selectedTemplate.name}" {applyMethod === 'new' ? 'cho nhóm mới' : `cho nhóm ${selectedGroup?.title || ''}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {applyMethod === 'existing' && selectedGroup ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
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
              <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
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
          onOpenChange={setShowSelectGroupDialog}
          onSelectGroup={(group) => {
            handleSelectGroup(group);
            setShowSelectGroupDialog(false);
            setShowApplyDialog(true);
          }}
          templateName={selectedTemplate.name}
        />
      )}
    </div>
  );
}


