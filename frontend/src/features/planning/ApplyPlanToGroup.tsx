'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { planService, Plan } from './services/plan.service';
import { TripGroup, getUserGroups } from './trip-groups-data';
import { toast } from 'sonner';

interface ApplyPlanToGroupProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApplyPlanToGroup({ 
  plan, 
  isOpen, 
  onClose, 
  onSuccess 
}: ApplyPlanToGroupProps) {
  const [groups, setGroups] = useState<TripGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [groupPlanStatus, setGroupPlanStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      // Get user's groups
      const userGroups = getUserGroups();
      setGroups(userGroups);

      // Check which groups already have plans
      const statusPromises = userGroups.map(async (group) => {
        try {
          const result = await planService.checkGroupPlan(parseInt(group.id));
          return { groupId: group.id, hasPlan: result.hasPlan };
        } catch (error) {
          return { groupId: group.id, hasPlan: false };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = statuses.reduce((acc, status) => {
        acc[status.groupId] = status.hasPlan;
        return acc;
      }, {} as Record<string, boolean>);

      setGroupPlanStatus(statusMap);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Không thể tải danh sách nhóm');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGroup = (group: TripGroup) => {
    setSelectedGroup(group);
  };

  const handleApply = async () => {
    if (!selectedGroup) {
      toast.error('Vui lòng chọn một nhóm');
      return;
    }

    try {
      setApplying(true);

      await planService.addPlanToGroup({
        plan_id: plan.plan_id,
        group_id: parseInt(selectedGroup.id)
      });

      toast.success(`Đã áp dụng kế hoạch "${plan.name}" cho nhóm "${selectedGroup.title}"`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error applying plan to group:', error);
      toast.error('Có lỗi xảy ra khi áp dụng kế hoạch');
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Áp dụng kế hoạch cho nhóm</DialogTitle>
          <DialogDescription>
            Chọn nhóm để áp dụng kế hoạch &quot;{plan.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Info */}
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Kế hoạch được chọn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {plan.thumbnail_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={plan.thumbnail_url}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description || 'Chưa có mô tả'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{plan.location?.name || 'Chưa có địa điểm'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(plan.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Groups List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Chọn nhóm</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="ml-2">Đang tải danh sách nhóm...</span>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Bạn chưa tham gia nhóm nào</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {groups.map((group) => {
                  const hasPlan = groupPlanStatus[group.id];
                  const isSelected = selectedGroup?.id === group.id;
                  
                  return (
                    <Card 
                      key={group.id} 
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'hover:border-purple-300'
                      }`}
                      onClick={() => handleSelectGroup(group)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={group.image}
                              alt={group.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{group.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {group.description}
                                </p>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                {isSelected && (
                                  <CheckCircle className="h-5 w-5 text-purple-600" />
                                )}
                                
                                {hasPlan ? (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Đã có kế hoạch
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                    Chưa có kế hoạch
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{group.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{group.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{group.members.count}/{group.members.max} thành viên</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Warning for groups with existing plans */}
          {selectedGroup && groupPlanStatus[selectedGroup.id] && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Nhóm đã có kế hoạch
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Nhóm &quot;{selectedGroup.title}&quot; đã có kế hoạch. Việc áp dụng kế hoạch mới sẽ thay thế kế hoạch hiện tại.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedGroup || applying}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {applying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang áp dụng...
              </>
            ) : (
              'Áp dụng kế hoạch'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
