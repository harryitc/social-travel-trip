'use client';

import { useState } from 'react';
import { TripGroup } from '@/features/trips/models/trip-group.model';
import { TripBreadcrumb } from '@/features/trips/components/trip-breadcrumb';
import { useEventListeners } from '@/features/stores/useEventListeners';

/**
 * Parallel Route: @breadcrumb
 * Breadcrumb component that listens to group selection events
 */
export default function BreadcrumbPage() {
  const [selectedGroup, setSelectedGroup] = useState<TripGroup | null>(null);

  // Listen to group selection events
  useEventListeners({
    'group:selected': (data) => {
      console.log('🍞 BreadcrumbPage: Group selected:', data.group.id, data.group.title);
      setSelectedGroup(data.group);
    },
    'group:updated': (data) => {
      // Update group info if it's the currently selected group
      if (selectedGroup && selectedGroup.id === data.group.id) {
        console.log('🍞 BreadcrumbPage: Group updated:', data.group.title);
        setSelectedGroup(data.group);
      }
    },
  });

  return (
    <div className="px-4 pt-4 bg-gray-50 dark:bg-gray-900">
      <TripBreadcrumb selectedGroup={selectedGroup} />
    </div>
  );
}
