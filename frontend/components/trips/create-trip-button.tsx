'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export function CreateTripButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isPrivate, setIsPrivate] = useState(false);
  
  const handleCreateTrip = () => {
    // Handle trip creation logic here
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo chuyến đi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo chuyến đi mới</DialogTitle>
          <DialogDescription>
            Tạo nhóm chuyến đi để kết nối với những người có cùng sở thích du lịch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trip-image" className="text-right">
              Ảnh nhóm
            </Label>
            <Input id="trip-image" type="file" accept="image/*" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tiêu đề
            </Label>
            <Input id="title" placeholder="Nhập tiêu đề chuyến đi" className="col-span-3" maxLength={255} />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Miêu tả
            </Label>
            <Textarea 
              id="description" 
              placeholder="Mô tả chi tiết về chuyến đi của bạn" 
              className="col-span-3" 
              maxLength={1000} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max-members" className="text-right">
              Số người tối đa
            </Label>
            <Input 
              id="max-members" 
              type="number" 
              defaultValue="10" 
              min="2" 
              max="100" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Thời gian đi
            </Label>
            <div className="col-span-3 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : <span>Ngày bắt đầu</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : <span>Ngày kết thúc</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Địa điểm
            </Label>
            <Input id="location" placeholder="Nhập địa điểm đi" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hashtags" className="text-right">
              Hashtag
            </Label>
            <Input id="hashtags" placeholder="DuLich, Bien, PhuQuoc,..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="privacy" className="text-right">
              Riêng tư
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="privacy" className="font-normal text-sm text-muted-foreground">
                {isPrivate ? 'Chỉ người được mời mới có thể tham gia' : 'Ai cũng có thể tham gia nhóm'}
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateTrip} className="bg-purple-600 hover:bg-purple-700 text-white">Tạo nhóm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}