'use client';

import React, { useState } from 'react';
import { TravelPlanTemplate } from './mock-data';
import { getUserGroups } from './trip-groups-data';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Button } from '@/components/ui/radix-ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { useToast } from '@/components/ui/radix-ui/use-toast';
import { cn } from '../../lib/utils';
import { Info, Users, Check, MapPin, Clock } from 'lucide-react';
import { API_ENDPOINT } from '@/config/api.config';

interface ApplyTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TravelPlanTemplate | null;
}

const ApplyTemplateModal: React.FC<ApplyTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('groups');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const { toast } = useToast();

  // Get user groups
  const userGroups = getUserGroups();

  // Handle apply template to group
  const handleApplyTemplate = () => {
    if (!selectedGroup || !template) return;

    setIsApplying(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Áp dụng thành công",
        description: `Đã áp dụng mẫu kế hoạch "${template.name}" cho nhóm "${userGroups.find(g => g.id === selectedGroup)?.title}"`,
      });
      setIsApplying(false);
      onClose();
    }, 1000);
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Áp dụng mẫu kế hoạch</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="groups" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="groups">Chọn nhóm</TabsTrigger>
            <TabsTrigger value="details">Chi tiết mẫu</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Chọn nhóm/chuyến đi bạn muốn áp dụng mẫu kế hoạch này:
            </p>

            <div className="space-y-3">
              {userGroups.map((group) => {
                const isSelected = selectedGroup === group.id;
                const hasPlan = group.hasPlan;

                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    <Avatar className="h-16 w-16 rounded-md">
                      <AvatarImage src={API_ENDPOINT.file_image_v2 + group.image} alt={group.title} className="object-cover" />
                      <AvatarFallback className="rounded-md">{group.title.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{group.title}</h3>
                        {hasPlan && (
                          <div className="group relative">
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>Đã có kế hoạch</span>
                            </Badge>
                            <div className="absolute left-0 top-full mt-2 z-50 w-64 p-2 bg-white dark:bg-gray-900 rounded-md shadow-md border text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                              Nhóm này đã có kế hoạch. Nếu áp dụng mẫu mới, kế hoạch cũ sẽ bị ghi đè.
                            </div>
                          </div>
                        )}
                        {isSelected && <Check className="h-5 w-5 text-primary ml-auto" />}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{group.location}</span>
                        </div>
                        <div className="hidden sm:block h-4 w-px bg-border"></div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{group.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{group.members.count} thành viên</span>
                        </div>
                        <div className="h-4 w-px bg-border"></div>
                        <span>{group.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">{template.name}</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{template.destination}</span>
                <div className="h-4 w-px bg-border"></div>
                <span>{template.duration} ngày</span>
              </div>
              <p className="text-sm">{template.description}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-border my-4"></div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Lịch trình chi tiết:</h3>

              {template.days.map((day, index) => (
                <div key={day.id} className="space-y-3">
                  <h4 className="font-medium">Ngày {index + 1}</h4>

                  <div className="space-y-3 pl-4 border-l">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.time}</span>
                          <span>{activity.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleApplyTemplate}
            disabled={!selectedGroup || isApplying}
            className={isApplying ? "opacity-80" : ""}
          >
            {isApplying ? "Đang áp dụng..." : "Áp dụng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyTemplateModal;
