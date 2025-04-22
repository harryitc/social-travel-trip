'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CalendarIcon, MapPin, Tag, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function MemoriesSearch() {
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [privacy, setPrivacy] = useState('');

  return (
    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-purple-100 dark:border-purple-900 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm kỉ niệm..."
            className="pl-9"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Địa điểm"
            className="pl-9"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={privacy} onValueChange={setPrivacy}>
          <SelectTrigger>
            <SelectValue placeholder="Quyền riêng tư" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Công khai</SelectItem>
            <SelectItem value="friends">Bạn bè</SelectItem>
            <SelectItem value="private">Riêng tư</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Thêm tag..."
            className="w-40"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Lọc nâng cao
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}