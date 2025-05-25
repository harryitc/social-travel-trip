'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { MapPin } from 'lucide-react';

import { GoogleMapsView } from './google-maps-view';
import { View360Search } from './view360-search';
import { View360Location, VIEW_360_LOCATIONS } from './view360-locations';

interface View360LocationTabsProps {
  defaultLocation?: string;
  className?: string;
  showInfoCard?: boolean;
}

export function View360LocationTabs({ defaultLocation = 'bai-sao', className = '', showInfoCard = true }: View360LocationTabsProps) {
  const [selectedLocation, setSelectedLocation] = useState<View360Location | null>(null);
  const [activeTab, setActiveTab] = useState<string>(defaultLocation);

  // Initialize with default location
  useEffect(() => {
    const defaultLoc = VIEW_360_LOCATIONS.find(loc => loc.id === defaultLocation);
    if (defaultLoc) {
      setSelectedLocation(defaultLoc);
    }
  }, [defaultLocation]);

  // Handle location selection from search
  const handleSelectLocation = (location: View360Location) => {
    setSelectedLocation(location);
    setActiveTab(location.id);
  };

  return (
    <div className={`${className} space-y-6`}>
      {/* Enhanced Search Section */}
      <div className="view360-search-section bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 overflow-visible relative z-50">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-400/10 dark:to-blue-400/10 p-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl">
            <View360Search
              onSelectLocation={handleSelectLocation}
              className="p-4 sm:p-6"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Location Details Panel */}
      {selectedLocation && (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 overflow-hidden relative z-10">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-sm">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white">{selectedLocation.name}</h3>
                <p className="text-sm sm:text-base text-white/90">
                  {selectedLocation.city}, {selectedLocation.region}
                </p>
                {selectedLocation.description && (
                  <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2">
                    {selectedLocation.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced 360 View Container */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-700/50 overflow-hidden relative z-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="hidden">
            {VIEW_360_LOCATIONS.map(location => (
              <TabsTrigger key={location.id} value={location.id}>
                {location.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {VIEW_360_LOCATIONS.map(location => (
            <TabsContent key={location.id} value={location.id} className="p-0 m-0">
              <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                <GoogleMapsView
                  mapUrl={location.googleMapsUrl}
                  height="100%"
                  width="100%"
                  title={location.name}
                  showInfoCard={showInfoCard}
                  reloadButton={true}
                  fullscreenButton={true}
                  className="w-full h-full"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default View360LocationTabs;
