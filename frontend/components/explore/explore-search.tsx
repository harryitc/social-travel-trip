'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

type FilterOption = {
  label: string;
  checked: boolean;
};

export function ExploreSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, FilterOption[]>>({
    region: [
      { label: 'Miền Bắc', checked: false },
      { label: 'Miền Trung', checked: false },
      { label: 'Miền Nam', checked: false },
    ],
    type: [
      { label: 'Biển', checked: false },
      { label: 'Núi', checked: false },
      { label: 'Thành phố', checked: false },
      { label: 'Làng quê', checked: false },
    ],
  });

  const toggleFilter = (category: string, index: number) => {
    const newFilters = { ...filters };
    newFilters[category][index].checked = !newFilters[category][index].checked;
    setFilters(newFilters);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-purple-100 dark:border-purple-900 p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm địa điểm du lịch..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Vùng miền</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filters.region.map((option, index) => (
                <DropdownMenuCheckboxItem
                  key={option.label}
                  checked={option.checked}
                  onCheckedChange={() => toggleFilter('region', index)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Loại địa điểm</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {filters.type.map((option, index) => (
                <DropdownMenuCheckboxItem
                  key={option.label}
                  checked={option.checked}
                  onCheckedChange={() => toggleFilter('type', index)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <SearchIcon className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}