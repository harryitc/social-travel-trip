'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Lock, Globe, Search, AlertCircle } from 'lucide-react';
import { TRIP_GROUPS, TripGroup } from './trip-groups-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

type SelectTripGroupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGroup: (group: TripGroup) => void;
  templateName: string;
};

export function SelectTripGroup({ open, onOpenChange, onSelectGroup, templateName }: SelectTripGroupProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn nhóm du lịch</DialogTitle>
          <DialogDescription>
            Áp dụng mẫu "{templateName}" cho một nhóm du lịch đã có
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhóm du lịch..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1 pr-4">
          <RadioGroup value={selectedGroupId || ''} onValueChange={setSelectedGroupId}>
            <div className="space-y-4">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`border rounded-lg p-4 transition-all ${
                      selectedGroupId === group.id
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20'
                        : 'border-border hover:border-purple-200 dark:hover:border-purple-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value={group.id} id={`group-${group.id}`} className="mt-1" />
                      
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line */}
                        <img
                          src={group.image}
                          alt={group.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor={`group-${group.id}`}
                            className="text-base font-medium cursor-pointer"
                          >
                            {group.title}
                          </Label>
                          
                          {group.isPrivate ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Riêng tư
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500 flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Công khai
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{group.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{group.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{group.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1" />
                              <span>{group.members.count}/{group.members.max} thành viên</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <div className="flex -space-x-2 mr-2">
                            {group.members.list.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {group.members.count > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                +{group.members.count - 3}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {group.hashtags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {group.hasPlan && (
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
                              Đã có kế hoạch
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Không tìm thấy nhóm du lịch nào phù hợp</p>
                </div>
              )}
            </div>
          </RadioGroup>
        </ScrollArea>

        {selectedGroupId && groups.find(g => g.id === selectedGroupId)?.hasPlan && (
          <Alert className="mt-4 border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lưu ý</AlertTitle>
            <AlertDescription>
              Nhóm này đã có kế hoạch du lịch. Nếu áp dụng mẫu mới, kế hoạch cũ sẽ bị ghi đè.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSelectGroup}
            disabled={!selectedGroupId}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Chọn nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
