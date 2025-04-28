'use client';

import { useState } from 'react';
import { TripGroup } from './mock-trip-groups';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Globe, Lock, UserPlus, FileText } from 'lucide-react';
import { InviteMembersDialog } from './invite-members-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TRAVEL_PLAN_TEMPLATES } from '../planning/mock-data';

type GroupChatDetailsProps = {
  group: TripGroup;
};

export function GroupChatDetails({ group }: GroupChatDetailsProps) {
  const [members, setMembers] = useState(group.members.list);
  const [memberCount, setMemberCount] = useState(group.members.count);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // Find a matching template for this group (in a real app, this would come from the database)
  const matchingTemplate = TRAVEL_PLAN_TEMPLATES.find(
    template => template.destination.includes(group.location.split(',')[0])
  );

  const handleInviteMembers = (newMembers: typeof group.members.list) => {
    setMembers([...members, ...newMembers]);
    setMemberCount(memberCount + newMembers.length);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Group info header */}
      <div className="p-3 border-b border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-900/10">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border border-purple-100 dark:border-purple-800 shadow-sm">
            <AvatarImage src={group.image} alt={group.title} />
            <AvatarFallback>{group.title[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{group.title}</h2>
            <div className="flex items-center gap-1 text-xs mt-1">
              {group.isPrivate ? (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  Riêng tư
                </Badge>
              ) : (
                <Badge className="bg-green-500 flex items-center gap-1 text-xs">
                  <Globe className="h-3 w-3" />
                  Công khai
                </Badge>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{group.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-purple-500" />
            <span>{group.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
            <span>{group.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-purple-500" />
            <span>{group.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-purple-500" />
            <span>{memberCount}/{group.members.max} thành viên</span>
          </div>
        </div>
      </div>

      {/* Members section */}
      <div className="p-3 border-b border-purple-100 dark:border-purple-900">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">Thành viên</h3>
            <Badge variant="outline" className="text-xs">{memberCount}</Badge>
          </div>
          {memberCount < group.members.max && (
            <InviteMembersDialog
              tripId={group.id}
              currentMembers={members}
              maxMembers={group.members.max}
              onInvite={handleInviteMembers}
            />
          )}
        </div>

        <ScrollArea className="h-[120px]">
          <div className="space-y-1">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary/50">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">{member.name}</span>
                  {member.role === 'admin' && (
                    <Badge variant="outline" className="text-[9px] h-4 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">Admin</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Plan section */}
      {matchingTemplate && (
        <div className="p-3 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">Kế hoạch chuyến đi</h3>
              <Badge variant="outline" className="text-[9px] h-4 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Đã áp dụng</Badge>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 h-auto p-2 justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
            onClick={() => setShowPlanDetails(true)}
          >
            <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 border border-purple-100 dark:border-purple-800">
              {/* eslint-disable-next-line */}
              <img
                src={matchingTemplate.image}
                alt={matchingTemplate.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">{matchingTemplate.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{matchingTemplate.duration} ngày</span>
                <span className="mx-1">•</span>
                <MapPin className="h-3 w-3" />
                <span>{matchingTemplate.destination.split(',')[0]}</span>
              </div>
            </div>
          </Button>

          <div className="mt-2 text-xs text-center text-muted-foreground">
            Nhấn vào kế hoạch để xem chi tiết
          </div>
        </div>
      )}

      {/* Plan details dialog */}
      {matchingTemplate && (
        <Dialog open={showPlanDetails} onOpenChange={setShowPlanDetails}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{matchingTemplate.name}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{matchingTemplate.destination}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
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

                      {matchingTemplate.days.map((day, dayIndex) => (
                        <TabsContent key={day.id} value={day.id} className="space-y-4">
                          <div className="space-y-4">
                            {day.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="border border-purple-100 dark:border-purple-900 rounded-lg p-4 space-y-2 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
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
                                  {activity.description}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  <span>{activity.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="chart">
                    <div className="border rounded-lg p-6">
                      <div className="grid grid-cols-[200px_1fr] h-[500px] overflow-auto">
                        <div className="border-r pr-2 pt-8">
                          {/* Location column */}
                          {matchingTemplate.days[0].activities.map((activity) => (
                            <div key={activity.id} className="h-12 flex items-center text-sm font-medium mb-2 pl-2">
                              {activity.location}
                            </div>
                          ))}
                        </div>
                        <div className="relative overflow-x-auto">
                          {/* Time header */}
                          <div className="flex border-b sticky top-0 bg-background z-10">
                            {Array.from({ length: 19 }).map((_, i) => (
                              <div key={i} className="w-20 flex-shrink-0 text-center text-xs text-muted-foreground py-2">
                                {(i + 6) % 24}:00
                              </div>
                            ))}
                          </div>

                          {/* Timeline rows */}
                          {matchingTemplate.days[0].activities.map((activity, index) => (
                            <div key={activity.id} className="flex h-12 mb-2 relative">
                              {/* Example timeline item - in a real implementation, these would be positioned based on time */}
                              <div
                                className="absolute h-8 top-2 rounded bg-purple-200 dark:bg-purple-800/50 border border-purple-300 dark:border-purple-700 flex items-center px-2 text-xs"
                                style={{
                                  left: `${(parseInt(activity.time.split(':')[0]) - 6) * 80}px`,
                                  width: '160px' // 2 hours
                                }}
                              >
                                {activity.time} - {activity.title}
                              </div>
                            </div>
                          ))}
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
    </div>
  );
}
