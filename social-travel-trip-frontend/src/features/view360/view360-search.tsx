'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import {
  VIEW_360_LOCATIONS,
  View360Location,
  searchLocations,
  getAllRegions,
  getAllCities
} from './view360-locations';

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
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const results = filteredByRegion.filter(location =>
        location.name.toLowerCase().includes(normalizedQuery) ||
        location.city.toLowerCase().includes(normalizedQuery) ||
        location.description.toLowerCase().includes(normalizedQuery)
      );
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
    <div className={`${className}`}>
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs p-4">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-medium">Tìm kiếm địa điểm 360°</h3>
        </div>

        {/* Region filters */}
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vùng miền:</div>
          <div className="flex flex-wrap gap-2">
            <Badge
              key="all"
              variant={selectedRegion === 'all' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
              onClick={() => handleRegionFilter('all')}
            >
              Tất cả
            </Badge>
            {regions.map(region => (
              <Badge
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                onClick={() => handleRegionFilter(region)}
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search input and results in one container */}
        <div className="relative" ref={searchContainerRef}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập tên địa điểm hoặc thành phố..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10 bg-white dark:bg-gray-950 border-purple-200 dark:border-purple-800 focus:ring-purple-500"
              onFocus={() => setShowResults(true)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-purple-100 dark:hover:bg-purple-900"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Compact search results */}
          {showResults && (
            <div className="mt-2 rounded-md border border-purple-100 dark:border-purple-800 bg-white dark:bg-gray-950 overflow-hidden max-h-[300px] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-purple-100 dark:divide-purple-800">
                  {searchResults.map(location => (
                    <div
                      key={location.id}
                      className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium text-purple-700 dark:text-purple-300 text-sm">{location.name}</div>
                          <div className="text-xs text-muted-foreground">{location.city}, {location.region}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-muted-foreground">
                  <X className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm">Không tìm thấy địa điểm nào phù hợp</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default View360Search;
