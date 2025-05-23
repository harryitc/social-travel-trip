'use client';

import { useState } from 'react';
import { TripGroup, TripGroupMember } from './models/trip-group.model';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Calendar, MapPin, Users, Clock, Globe, Lock, UserPlus, Pencil, Trash2, Plus, ChevronRight, Copy, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/radix-ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Input } from '@/components/ui/radix-ui/input';
import { notification } from 'antd';
import { TRAVEL_PLAN_TEMPLATES } from '../planning/mock-data';
import TripPlanEditor from './TripPlanEditor';
import { TripPlan } from './types';
import { getTripPlanByGroupId, updateTripPlan } from './mock-trip-plans';

type GroupChatDetailsProps = {
  group: TripGroup;
  isCollapsed?: boolean;
};

export function GroupChatDetails({ group, isCollapsed = false }: GroupChatDetailsProps) {
  const [members, setMembers] = useState<TripGroupMember[]>(group.members.list);
  const [memberCount, setMemberCount] = useState(group.members.count);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showTripPlanEditor, setShowTripPlanEditor] = useState(false);

  // Get trip plan from mock data
  const [tripPlan, setTripPlan] = useState<TripPlan | undefined>(
    getTripPlanByGroupId(group.id)
  );

  // Find a matching template for this group (in a real app, this would come from the database)
  const matchingTemplate = TRAVEL_PLAN_TEMPLATES.find(
    template => group.location && template.destination.includes(group.getLocationShort())
  );

  const handleInviteMembers = (newMembers: TripGroupMember[]) => {
    setMembers([...members, ...newMembers]);
    setMemberCount(memberCount + newMembers.length);
  };

  const handleOpenInviteDialog = () => {
    setShowInviteDialog(true);
    setShowMemberList(false);
  };

  // Copy join code to clipboard
  const copyJoinCode = async () => {
    if (group.join_code) {
      try {
        await navigator.clipboard.writeText(group.join_code);
        notification.success({
          message: 'Đã sao chép',
          description: 'Mã mời đã được sao chép vào clipboard',
          placement: 'topRight',
          duration: 2,
        });
      } catch (error) {
        notification.error({
          message: 'Lỗi sao chép',
          description: 'Không thể sao chép mã mời',
          placement: 'topRight',
          duration: 3,
        });
      }
    }
  };

  // Xử lý khi lưu kế hoạch chuyến đi
  const handleSaveTripPlan = async (updatedPlan: TripPlan) => {
    try {
      // Trong thực tế, đây là nơi bạn sẽ gọi API để lưu kế hoạch
      const savedPlan = updateTripPlan(updatedPlan);
      setTripPlan(savedPlan);
      return Promise.resolve();
    } catch (error) {
      console.error('Lỗi khi lưu kế hoạch:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Group info header */}
      <div className="p-2 border-b border-purple-100 dark:border-purple-900 bg-teal-50/50 dark:bg-teal-900/10">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border border-teal-100 dark:border-teal-800 shadow-xs">
            <AvatarImage src={group.image} alt={group.title} />
            <AvatarFallback>{group.title[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base truncate">{group.title}</h2>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              {group.isPrivate ? (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5">
                  <Lock className="h-3 w-3" />
                  {!isCollapsed && "Riêng tư"}
                </Badge>
              ) : (
                <Badge className="bg-green-500 flex items-center gap-1 text-xs h-5">
                  <Globe className="h-3 w-3" />
                  {!isCollapsed && "Công khai"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {!isCollapsed && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{group.description}</p>}

        <div className={`${isCollapsed ? 'grid grid-cols-2' : 'grid grid-cols-2'} gap-2 text-sm`}>
          {group.location && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-teal-500" />
              <span className="truncate">{group.location.split(',')[0]}</span>
            </div>
          )}
          {!isCollapsed && (
            <>
              {group.date && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-teal-500" />
                  <span>{group.date}</span>
                </div>
              )}
              {group.duration && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4 text-teal-500" />
                  <span>{group.duration}</span>
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4 text-teal-500" />
            <span>{memberCount}/{group.members.max}</span>
          </div>
        </div>
      </div>

      {/* Join Code section */}
      {group.join_code && (
        <div className="p-3 border-b border-teal-100 dark:border-teal-900 bg-teal-50/30 dark:bg-teal-900/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <QrCode className="h-4 w-4 text-teal-500" />
              <h3 className="font-medium text-sm">Mã mời</h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={group.join_code}
                readOnly
                className="font-mono text-sm bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700"
              />
              <Button
                onClick={copyJoinCode}
                variant="outline"
                size="sm"
                className="px-3 border-teal-200 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-900/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chia sẻ mã này để mời người khác tham gia nhóm
            </p>
          </div>
        </div>
      )}

      {/* Members section - Simplified for vertical layout */}
      {isCollapsed ? (
        <div className="p-1 border-b border-teal-100 dark:border-teal-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-xs">Thành viên</h3>
              <Badge variant="outline" className="text-[10px] h-4">{memberCount}/{group.members.max}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 p-0 w-6 hover:bg-teal-100 dark:hover:bg-teal-900/20"
                onClick={() => setShowMemberList(true)}
              >
                <Users className="h-3 w-3 text-teal-500" />
              </Button>

              {!group.isFull() && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 p-0 w-6 hover:bg-teal-100 dark:hover:bg-teal-900/20"
                  onClick={() => setShowInviteDialog(true)}
                >
                  <UserPlus className="h-3 w-3 text-teal-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Chế độ thu gọn: chỉ hiển thị avatar */}
          <div className="flex flex-wrap gap-1 mt-1">
            {members.slice(0, 8).map((member) => (
              <Avatar key={member.id || member.group_member_id} className="h-6 w-6 border border-teal-100 dark:border-teal-800" title={member.name || 'Unknown'}>
                <AvatarImage src={member.avatar} alt={member.name || 'Unknown'} />
                <AvatarFallback>{(member.name || 'U')[0]}</AvatarFallback>
              </Avatar>
            ))}
            {members.length > 8 && (
              <div
                className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-[10px] text-teal-700 dark:text-teal-300 cursor-pointer"
                onClick={() => setShowMemberList(true)}
              >
                +{members.length - 8}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 border-b border-teal-100 dark:border-teal-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-sm">Thành viên</h3>
              <Badge variant="outline" className="text-xs h-5">{memberCount}/{group.members.max}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/20"
                onClick={() => setShowMemberList(true)}
              >
                <Users className="h-3.5 w-3.5 text-teal-500" />
                <span>Xem tất cả</span>
                <ChevronRight className="h-3.5 w-3.5 ml-0.5 text-muted-foreground" />
              </Button>

              {!group.isFull() && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/20"
                  onClick={() => setShowInviteDialog(true)}
                >
                  <UserPlus className="h-3.5 w-3.5 text-teal-500" />
                  <span>Mời</span>
                </Button>
              )}
            </div>
          </div>

          {/* Chế độ đầy đủ */}
          <div className="space-y-1">
            {members.slice(0, 5).map((member) => (
              <div key={member.id || member.group_member_id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary/50">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={member.avatar} alt={member.name || 'Unknown'} />
                  <AvatarFallback>{(member.name || 'U')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">{member.name || 'Unknown User'}</span>
                  {member.role === 'admin' && (
                    <Badge variant="outline" className="text-xs h-5 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800">Admin</Badge>
                  )}
                </div>
              </div>
            ))}

            {/* Hiển thị số thành viên còn lại nếu có nhiều hơn 5 */}
            {members.length > 5 && (
              <Button
                variant="ghost"
                className="w-full h-8 text-sm text-muted-foreground hover:bg-secondary/50"
                onClick={() => setShowMemberList(true)}
              >
                Xem thêm {members.length - 5} thành viên khác
              </Button>
            )}
          </div>
        </div>
      )}

      {/* TODO: Fix type conflicts and re-enable dialogs */}
      {/* Dialog hiển thị đầy đủ danh sách thành viên */}
      {/* <MemberListDialog
        members={members}
        maxMembers={group.members.max}
        isOpen={showMemberList}
        onClose={() => setShowMemberList(false)}
        onInvite={handleOpenInviteDialog}
      /> */}

      {/* Dialog mời thành viên */}
      {/* <InviteMembersDialog
        tripId={group.id}
        currentMembers={members}
        maxMembers={group.members.max}
        onInvite={handleInviteMembers}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      /> */}

      {/* Plan section - Simplified for vertical layout */}
      {(tripPlan || matchingTemplate) && isCollapsed ? (
        <div className="p-1 flex-shrink-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-xs">Kế hoạch</h3>
            </div>
            {tripPlan && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 p-0 w-6 hover:bg-teal-100 dark:hover:bg-teal-900/20"
                onClick={() => setShowTripPlanEditor(true)}
              >
                <Pencil className="h-3 w-3 text-teal-500" />
              </Button>
            )}
          </div>

          {/* Chế độ thu gọn */}
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              className="flex items-center justify-center p-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 group rounded-lg"
              onClick={() => tripPlan ? setShowTripPlanEditor(true) : setShowPlanDetails(true)}
            >
              <div className="h-8 w-8 rounded-md overflow-hidden shrink-0 border border-teal-100 dark:border-teal-800 shadow-xs">
                {/* eslint-disable-next-line */}
                <img
                  src={(tripPlan || matchingTemplate)?.image}
                  alt={(tripPlan || matchingTemplate)?.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Button>
            <div className="text-left flex-1 min-w-0">
              <div className="font-medium text-xs truncate">{(tripPlan || matchingTemplate)?.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-teal-500 flex-shrink-0" />
                <span className="truncate">{(tripPlan || matchingTemplate)?.duration} ngày</span>
              </div>
            </div>
          </div>
        </div>
      ) : (tripPlan || matchingTemplate) && (
        <div className="p-3 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-sm">Kế hoạch</h3>
              <Badge variant="outline" className="text-xs h-5 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Đã áp dụng</Badge>
            </div>
            {tripPlan && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs gap-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/20"
                onClick={() => setShowTripPlanEditor(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-teal-500" />
                <span>Chỉnh sửa</span>
              </Button>
            )}
          </div>

          {/* Chế độ đầy đủ */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-3 h-auto p-3 justify-start hover:bg-teal-50 dark:hover:bg-teal-900/20 group rounded-lg"
            onClick={() => tripPlan ? setShowTripPlanEditor(true) : setShowPlanDetails(true)}
          >
            <div className="h-16 w-16 rounded-md overflow-hidden shrink-0 border border-teal-100 dark:border-teal-800 shadow-xs">
              {/* eslint-disable-next-line */}
              <img
                src={(tripPlan || matchingTemplate)?.image}
                alt={(tripPlan || matchingTemplate)?.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{(tripPlan || matchingTemplate)?.name}</div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-500" />
                <span>{(tripPlan || matchingTemplate)?.duration} ngày</span>
                <span className="mx-1">•</span>
                <MapPin className="h-3.5 w-3.5 text-teal-500" />
                <span>{(tripPlan || matchingTemplate)?.destination.split(',')[0]}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Nhấn để {tripPlan ? 'chỉnh sửa' : 'xem chi tiết'} lịch trình
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Plan details dialog */}
      {matchingTemplate && (
        <Dialog open={showPlanDetails} onOpenChange={setShowPlanDetails}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <span>{matchingTemplate.name}</span>
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  Đã áp dụng
                </Badge>
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span>{matchingTemplate.destination}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span>{matchingTemplate.duration} ngày</span>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              <div className="aspect-video rounded-lg overflow-hidden border border-purple-100 dark:border-purple-800">
                {/* eslint-disable-next-line */}
                <img
                  src={matchingTemplate.image}
                  alt={matchingTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Mô tả</h3>
                <p className="text-muted-foreground">{matchingTemplate.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Lịch trình chi tiết</h3>
                <Tabs defaultValue="schedule" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="schedule">Lịch trình chi tiết</TabsTrigger>
                    <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="schedule" className="space-y-4">
                    <Tabs defaultValue={matchingTemplate.days[0].id} className="w-full">
                      <TabsList className="mb-4 flex flex-wrap">
                        {matchingTemplate.days.map((day, index) => (
                          <TabsTrigger key={day.id} value={day.id}>
                            Ngày {index + 1}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {matchingTemplate.days.map((day) => (
                        <TabsContent key={day.id} value={day.id} className="space-y-4">
                          <div className="space-y-4">
                            {day.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="border border-purple-100 dark:border-purple-900 rounded-lg p-4 space-y-2 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-purple-600 dark:text-purple-400 w-16">
                                      {activity.time}
                                    </span>
                                    <span className="font-medium">{activity.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
                                      title="Chỉnh sửa hoạt động"
                                    >
                                      <Pencil className="h-3.5 w-3.5 text-purple-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                                      title="Xóa hoạt động"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {activity.description}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  <span>{activity.location}</span>
                                </div>
                              </div>
                            ))}

                            {/* Nút thêm hoạt động mới */}
                            <Button
                              variant="outline"
                              className="w-full py-6 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                            >
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                  <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Thêm hoạt động mới</span>
                                <span className="text-xs text-muted-foreground">Nhấn để thêm hoạt động vào lịch trình</span>
                              </div>
                            </Button>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="chart">
                    <div className="border rounded-lg p-4">
                      {/* Chart description */}
                      <div className="mb-4 text-sm text-muted-foreground">
                        <p>Biểu đồ lịch trình hiển thị các hoạt động theo thời gian từ 6:00 đến 00:00.</p>
                      </div>

                      {/* Activity type legend */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-red-200 dark:bg-red-900/50"></div>
                          <span className="text-xs text-red-800 dark:text-red-300">Ăn uống</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-blue-200 dark:bg-blue-900/50"></div>
                          <span className="text-xs text-blue-800 dark:text-blue-300">Tham quan</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-amber-200 dark:bg-amber-900/50"></div>
                          <span className="text-xs text-amber-800 dark:text-amber-300">Cà phê</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-purple-200 dark:bg-purple-900/50"></div>
                          <span className="text-xs text-purple-800 dark:text-purple-300">Mua sắm</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-green-200 dark:bg-green-900/50"></div>
                          <span className="text-xs text-green-800 dark:text-green-300">Di chuyển</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-1 bg-gray-200 dark:bg-gray-800"></div>
                          <span className="text-xs text-gray-800 dark:text-gray-300">Khác</span>
                        </div>
                      </div>

                      {/* Chart container */}
                      <div className="grid grid-cols-[200px_1fr] border rounded-md overflow-hidden">
                        {/* Header row */}
                        <div className="bg-muted/30 border-b p-2 font-medium text-sm">Địa điểm</div>
                        <div className="flex border-b bg-muted/30 overflow-hidden">
                          <div className="flex min-w-[1440px]"> {/* 18 hours * 80px */}
                            {Array.from({ length: 19 }).map((_, i) => (
                              <div key={i} className="w-[80px] shrink-0 text-center text-xs text-muted-foreground py-2 border-r last:border-r-0">
                                {(i + 6) % 24}:00
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="max-h-[500px] overflow-auto">
                          {/* Location column */}
                          {matchingTemplate.days[0].activities.map((activity) => {
                            // Extract main location (before first comma)
                            const mainLocation = activity.location.split(',')[0].trim();
                            return (
                              <div key={activity.id} className="h-12 flex items-center text-sm font-medium border-b last:border-b-0 px-3 truncate">
                                {mainLocation}
                              </div>
                            );
                          })}
                        </div>

                        <div className="relative overflow-x-auto max-h-[500px]">
                          <div className="min-w-[1440px]"> {/* 18 hours * 80px */}
                            {/* Timeline grid background */}
                            <div className="absolute inset-0 grid grid-cols-18 w-full h-full pointer-events-none">
                              {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="border-r h-full last:border-r-0"></div>
                              ))}
                            </div>

                            {/* Timeline rows */}
                            {matchingTemplate.days[0].activities.map((activity, index) => {
                              // Determine activity type for styling
                              let bgColor = "bg-gray-200 dark:bg-gray-800";
                              let textColor = "text-gray-800 dark:text-gray-300";

                              if (activity.title.includes("Ăn") || activity.title.includes("ăn")) {
                                bgColor = "bg-red-200 dark:bg-red-900/50";
                                textColor = "text-red-800 dark:text-red-300";
                              } else if (activity.title.includes("Tham quan") || activity.title.includes("thăm")) {
                                bgColor = "bg-blue-200 dark:bg-blue-900/50";
                                textColor = "text-blue-800 dark:text-blue-300";
                              } else if (activity.title.includes("Cà phê") || activity.title.includes("cà phê")) {
                                bgColor = "bg-amber-200 dark:bg-amber-900/50";
                                textColor = "text-amber-800 dark:text-amber-300";
                              } else if (activity.title.includes("Mua") || activity.title.includes("mua")) {
                                bgColor = "bg-purple-200 dark:bg-purple-900/50";
                                textColor = "text-purple-800 dark:text-purple-300";
                              } else if (activity.title.includes("Di chuyển") || activity.title.includes("đi")) {
                                bgColor = "bg-green-200 dark:bg-green-900/50";
                                textColor = "text-green-800 dark:text-green-300";
                              }

                              // Calculate position and width
                              const [hours, minutes] = activity.time.split(':').map(Number);
                              const startPosition = (hours - 6) * 80 + (minutes / 60) * 80;

                              // Calculate duration (default to 1.5 hours if it's the last activity)
                              let duration = 1.5;
                              if (index < matchingTemplate.days[0].activities.length - 1) {
                                const nextActivity = matchingTemplate.days[0].activities[index + 1];
                                const [nextHours, nextMinutes] = nextActivity.time.split(':').map(Number);
                                const nextTimeInHours = nextHours + nextMinutes / 60;
                                const currentTimeInHours = hours + minutes / 60;
                                duration = nextTimeInHours - currentTimeInHours;
                              }

                              const width = duration * 80;

                              return (
                                <div key={activity.id} className="h-12 border-b last:border-b-0 relative">
                                  <div
                                    className={`absolute h-8 top-2 rounded-md border ${bgColor} ${textColor} flex items-center px-2 text-xs shadow-xs overflow-hidden group cursor-pointer hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-600 hover:z-10`}
                                    style={{
                                      left: `${startPosition}px`,
                                      width: `${width}px`,
                                    }}
                                    title={`${activity.time} - ${activity.title}`}
                                  >
                                    <div className="truncate flex-1">
                                      {activity.time} - {activity.title}
                                    </div>
                                    <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 p-0 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
                                        title="Chỉnh sửa"
                                      >
                                        <Pencil className="h-2.5 w-2.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* TripPlanEditor */}
      {tripPlan && (
        <TripPlanEditor
          plan={tripPlan}
          isOpen={showTripPlanEditor}
          onClose={() => setShowTripPlanEditor(false)}
          onSave={handleSaveTripPlan}
        />
      )}
    </div>
  );
}
