'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/radix-ui/input';
import { Button } from '@/components/ui/radix-ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/radix-ui/popover';
import { Label } from '@/components/ui/radix-ui/label';
import { Checkbox } from '@/components/ui/radix-ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';

type GroupSearchBarProps = {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
};

export interface SearchFilters {
  location?: string;
  isPrivate?: boolean;
  hasPlan?: boolean;
  memberCount?: 'any' | 'small' | 'medium' | 'large';
  sortBy?: 'newest' | 'oldest' | 'members' | 'name';
}

export function GroupSearchBar({ onSearch, placeholder = "Tìm kiếm nhóm..." }: GroupSearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    memberCount: 'any',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleClearFilters = () => {
    setFilters({
      memberCount: 'any',
      sortBy: 'newest',
    });
    setQuery('');
    onSearch('', {
      memberCount: 'any',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = filters.location || 
    filters.isPrivate !== undefined || 
    filters.hasPlan !== undefined || 
    filters.memberCount !== 'any' || 
    filters.sortBy !== 'newest';

  return (
    <div className="space-y-3">
      {/* Main search bar */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={handleSearch}
          className="px-4"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`px-4 ${hasActiveFilters ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300' : ''}`}
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && <span className="ml-1 text-xs">•</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Bộ lọc tìm kiếm</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>

              {/* Location filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  placeholder="Ví dụ: Đà Lạt, Nha Trang..."
                  value={filters.location || ''}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
                />
              </div>

              {/* Group type filters */}
              <div className="space-y-3">
                <Label>Loại nhóm</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private"
                      checked={filters.isPrivate === true}
                      onCheckedChange={(checked) => 
                        setFilters({ 
                          ...filters, 
                          isPrivate: checked ? true : undefined 
                        })
                      }
                    />
                    <Label htmlFor="private" className="text-sm">Nhóm riêng tư</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPlan"
                      checked={filters.hasPlan === true}
                      onCheckedChange={(checked) => 
                        setFilters({ 
                          ...filters, 
                          hasPlan: checked ? true : undefined 
                        })
                      }
                    />
                    <Label htmlFor="hasPlan" className="text-sm">Có kế hoạch</Label>
                  </div>
                </div>
              </div>

              {/* Member count filter */}
              <div className="space-y-2">
                <Label>Số lượng thành viên</Label>
                <Select
                  value={filters.memberCount}
                  onValueChange={(value: any) => setFilters({ ...filters, memberCount: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Tất cả</SelectItem>
                    <SelectItem value="small">Nhỏ (1-5 người)</SelectItem>
                    <SelectItem value="medium">Vừa (6-15 người)</SelectItem>
                    <SelectItem value="large">Lớn (16+ người)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort by */}
              <div className="space-y-2">
                <Label>Sắp xếp theo</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => setFilters({ ...filters, sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="members">Số thành viên</SelectItem>
                    <SelectItem value="name">Tên nhóm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => {
                  handleSearch();
                  setShowFilters(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Áp dụng bộ lọc
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.location && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs dark:bg-purple-900/30 dark:text-purple-300">
              <span>Địa điểm: {filters.location}</span>
              <button
                onClick={() => setFilters({ ...filters, location: undefined })}
                className="hover:bg-purple-200 rounded-full p-0.5 dark:hover:bg-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.isPrivate && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs dark:bg-purple-900/30 dark:text-purple-300">
              <span>Riêng tư</span>
              <button
                onClick={() => setFilters({ ...filters, isPrivate: undefined })}
                className="hover:bg-purple-200 rounded-full p-0.5 dark:hover:bg-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.hasPlan && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs dark:bg-purple-900/30 dark:text-purple-300">
              <span>Có kế hoạch</span>
              <button
                onClick={() => setFilters({ ...filters, hasPlan: undefined })}
                className="hover:bg-purple-200 rounded-full p-0.5 dark:hover:bg-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
