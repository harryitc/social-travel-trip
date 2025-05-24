'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radix-ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Calendar, MapPin, Users, Lock, Globe, Search, AlertCircle, UserPlus } from 'lucide-react';
import { TRIP_GROUPS, TripGroup } from './trip-groups-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/radix-ui/alert';
import { API_ENDPOINT } from '@/config/api.config';


type SelectTripGroupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGroup: (group: TripGroup) => void;
  onCreateNewGroup?: () => void;
  templateName: string;
};

export function SelectTripGroup({ open, onOpenChange, onSelectGroup, onCreateNewGroup, templateName }: SelectTripGroupProps) {
  const [groups] = useState<TripGroup[]>(TRIP_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectGroup = () => {
    if (selectedGroupId) {
      const selectedGroup = groups.find(group => group.id === selectedGroupId);
      if (selectedGroup) {
        onSelectGroup(selectedGroup);
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        // Reset state khi dialog đóng
        setSelectedGroupId(null);
        setSearchQuery('');
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base">Chọn nhóm du lịch</DialogTitle>
          <DialogDescription className="text-xs">
            Áp dụng mẫu &quot;{templateName}&quot; cho một nhóm du lịch đã có
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhóm du lịch..."
            className="pl-9 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedGroupId && groups.find(g => g.id === selectedGroupId)?.hasPlan && (
          <Alert className="mb-3 border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs">Lưu ý</AlertTitle>
            <AlertDescription className="text-xs">
              Nhóm này đã có kế hoạch du lịch. Nếu áp dụng mẫu mới, kế hoạch cũ sẽ bị ghi đè.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-auto border border-gray-200 dark:border-gray-800 rounded-md" style={{ height: "50vh" }}>
          <div className="p-2">
          <RadioGroup value={selectedGroupId || ''} onValueChange={setSelectedGroupId}>
            <div className="space-y-2">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`border rounded-md p-2.5 transition-all ${
                      selectedGroupId === group.id
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20'
                        : 'border-border hover:border-purple-200 dark:hover:border-purple-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <RadioGroupItem value={group.id} id={`group-${group.id}`} className="mt-1" />

                      <div className="h-10 w-10 rounded-md overflow-hidden shrink-0">
                        {/* eslint-disable-next-line */}
                        <img
                          src={group.image}
                          alt={group.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor={`group-${group.id}`}
                            className="text-sm font-medium cursor-pointer truncate"
                          >
                            {group.title}
                          </Label>

                          {group.isPrivate ? (
                            <Badge variant="secondary" className="flex items-center gap-0.5 text-[10px] h-5 px-1.5">
                              <Lock className="h-2.5 w-2.5" />
                              Riêng tư
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500 flex items-center gap-0.5 text-[10px] h-5 px-1.5">
                              <Globe className="h-2.5 w-2.5" />
                              Công khai
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground mt-0.5">
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-0.5" />
                              <span className="truncate">{group.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-0.5" />
                              <span>{group.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-0.5" />
                              <span>{group.members.count}/{group.members.max}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex -space-x-1 mr-1">
                            {group.members.list.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="h-5 w-5 border border-background">
                                <AvatarImage src={API_ENDPOINT.file_image_v2 + member.avatar} alt={member.name} />
                                <AvatarFallback className="text-[10px]">{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {group.members.count > 3 && (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] border border-background">
                                +{group.members.count - 3}
                              </div>
                            )}
                          </div>

                          {group.hasPlan && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 text-[10px] px-1.5 py-0 h-5">
                              Đã có kế hoạch
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">Không tìm thấy nhóm du lịch nào phù hợp</p>
                </div>
              )}
            </div>
          </RadioGroup>
          </div>
        </div>



        <div className="mt-3 pt-2">
          <div
            className="flex items-center gap-2 p-2.5 border border-dashed border-purple-300 dark:border-purple-800 rounded-md bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
            onClick={() => {
              if (onCreateNewGroup) {
                onCreateNewGroup();
              } else {
                onOpenChange(false);
              }
            }}
          >
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Tạo nhóm mới</h4>
              <p className="text-xs text-muted-foreground">Tạo nhóm du lịch mới với mẫu kế hoạch này</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              // Reset state trước khi đóng dialog
              setSelectedGroupId(null);
              setSearchQuery('');
              onOpenChange(false);
            }}
          >
            Hủy
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleSelectGroup}
            disabled={!selectedGroupId}
          >
            Áp dụng cho nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
