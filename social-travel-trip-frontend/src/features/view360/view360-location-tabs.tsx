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
      {/* Search component với viền rõ ràng hơn */}
      <div className="bg-white rounded-xl shadow-md border border-purple-200">
        <View360Search
          onSelectLocation={handleSelectLocation}
          className="p-4"
        />
      </div>

      {/* Location details panel - thiết kế đẹp hơn */}
      {selectedLocation && (
        <div className="bg-white rounded-xl shadow-md border border-purple-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-800">{selectedLocation.name}</h3>
              <p className="text-sm text-gray-600">
                {selectedLocation.city}, {selectedLocation.region}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Location content với viền rõ ràng hơn */}
      <div className="bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="hidden">
            {VIEW_360_LOCATIONS.map(location => (
              <TabsTrigger key={location.id} value={location.id}>
                {location.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {VIEW_360_LOCATIONS.map(location => (
            <TabsContent key={location.id} value={location.id} className="p-0">
              <GoogleMapsView
                mapUrl={location.googleMapsUrl}
                height="600px"
                title={location.name}
                showInfoCard={showInfoCard}
                reloadButton={true}
                className="rounded-none border-0"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default View360LocationTabs;
