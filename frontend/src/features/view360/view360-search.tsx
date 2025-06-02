'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import {
  VIEW_360_LOCATIONS,
  View360Location,
  getAllRegions
} from './view360-locations';
import { matchesSearch, expandSearchQuery } from './utils/search-utils';

interface View360SearchProps {
  onSelectLocation: (location: View360Location) => void;
  className?: string;
}

export function View360Search({ onSelectLocation, className = '' }: View360SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<View360Location[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [regions] = useState<string[]>(getAllRegions());
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Perform search when query changes or region changes
  useEffect(() => {
    // Filter by region first
    let filteredByRegion = VIEW_360_LOCATIONS;
    if (selectedRegion !== 'all') {
      filteredByRegion = VIEW_360_LOCATIONS.filter(
        location => location.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    // Then filter by search query
    if (searchQuery.trim() === '') {
      setSearchResults(filteredByRegion);
    } else {
      // Use enhanced search with multiple query variations
      const queryVariations = expandSearchQuery(searchQuery);
      const results = filteredByRegion.filter(location => {
        return queryVariations.some(query =>
          matchesSearch(query, location.name) ||
          matchesSearch(query, location.city) ||
          matchesSearch(query, location.description)
        );
      });
      setSearchResults(results);
    }
  }, [searchQuery, selectedRegion]);

  // Xử lý sự kiện click bên ngoài để đóng danh sách kết quả tìm kiếm
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  // Handle location selection
  const handleSelectLocation = (location: View360Location) => {
    // Gọi callback để thông báo cho component cha về địa điểm được chọn
    onSelectLocation(location);

    // Reset thanh tìm kiếm và đóng kết quả
    setSearchQuery('');
    setShowResults(false);

    // Nếu bạn muốn giữ lại region filter, hãy giữ dòng dưới đây
    // Nếu bạn muốn reset cả region filter, hãy uncomment dòng tiếp theo
    // setSelectedRegion('all');
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  // Filter by region
  const handleRegionFilter = (region: string) => {
    setSelectedRegion(region);
    setShowResults(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Globe className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tìm kiếm địa điểm 360°</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Khám phá các địa điểm du lịch tuyệt đẹp</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">💡 Hỗ trợ tìm kiếm không dấu: "ha long" → "Hạ Long"</p>
        </div>
      </div>

      {/* Enhanced Region Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chọn khu vực:</h4>
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            variant={selectedRegion === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRegion === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md'
                : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30'
            }`}
            onClick={() => handleRegionFilter('all')}
          >
            <Globe className="h-3 w-3 mr-1" />
            Tất cả
          </Badge>
          {regions.map(region => (
            <Badge
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              className={`cursor-pointer transition-all duration-200 ${
                selectedRegion === region
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md'
                  : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30'
              }`}
              onClick={() => handleRegionFilter(region)}
            >
              {region}
            </Badge>
          ))}
        </div>
      </div>

      {/* Enhanced Search Input */}
      <div className="view360-search-container relative" ref={searchContainerRef}>
        <div className="relative">
          <Input
            type="text"
            placeholder="VD: 'ha long', 'sai gon', 'hoi an'... (có thể gõ không dấu)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 pr-12 h-12 text-base bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all duration-200"
            onFocus={() => setShowResults(true)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Enhanced Search Results */}
        {showResults && (
          <div className="view360-search-results absolute top-full left-0 right-0 mt-2 rounded-xl border-2 border-purple-200/50 dark:border-purple-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-hidden max-h-[400px] overflow-y-auto shadow-xl z-[9999]">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-purple-100 dark:divide-purple-800">
                {searchResults.map(location => (
                  <div
                    key={location.id}
                    className="p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 cursor-pointer transition-all duration-200 group"
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                        <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-purple-700 dark:text-purple-300 text-sm group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
                          {location.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          {location.city}, {location.region}
                        </div>
                        {location.description && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                            {location.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto mb-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Không tìm thấy địa điểm nào</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default View360Search;
