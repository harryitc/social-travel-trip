'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function SearchTrips() {
  const [date, setDate] = useState<Date>();
  
  return (
    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-purple-100 dark:border-purple-900 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm nhóm..."
            className="pl-9"
          />
        </div>
        
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Địa điểm"
            className="pl-9"
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
              {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>Thời gian đi</span>}
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
        
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo hashtag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DaLat">DaLat</SelectItem>
            <SelectItem value="Bien">Bien</SelectItem>
            <SelectItem value="NhaTrang">NhaTrang</SelectItem>
            <SelectItem value="Sapa">Sapa</SelectItem>
            <SelectItem value="PhuQuoc">PhuQuoc</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <SearchIcon className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}