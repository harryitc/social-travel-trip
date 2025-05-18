'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';


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

  // Không còn cần phương thức getLocationTabs nữa

  return (
    <div className={className}>
      {/* Search component */}
      <View360Search
        onSelectLocation={handleSelectLocation}
        className="mb-6"
      />

      {/* Location content */}
      <div className="mt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="hidden">
            {/* TabsList cần tồn tại nhưng sẽ được ẩn đi */}
            {VIEW_360_LOCATIONS.map(location => (
              <TabsTrigger key={location.id} value={location.id}>
                {location.name}
              </TabsTrigger>
            ))}
          </TabsList>
        {/* Tab content for each location */}
        {VIEW_360_LOCATIONS.map(location => (
          <TabsContent key={location.id} value={location.id} className="mt-4">
            <div>
              <GoogleMapsView
                mapUrl={location.googleMapsUrl}
                height="600px"
                title={location.name}
                showInfoCard={showInfoCard}
                reloadButton={true}
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
