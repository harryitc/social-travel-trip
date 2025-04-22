'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { MemoriesGrid } from '@/components/memories/memories-grid';
import { MemoriesSearch } from '@/components/memories/memories-search';
import { CreateAlbumButton } from '@/components/memories/create-album-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapView } from '@/components/memories/map-view';
import { TimelineView } from '@/components/memories/timeline-view';

export default function MemoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'timeline'>('grid');

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          title="Kỉ niệm" 
          description="Lưu giữ những khoảnh khắc đáng nhớ"
        />
        <CreateAlbumButton />
      </div>

      <MemoriesSearch />

      <Tabs defaultValue="all" className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="albums">Album</TabsTrigger>
            <TabsTrigger value="favorites">Yêu thích</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger 
                value="grid" 
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-purple-500/10' : ''}
              >
                Lưới
              </TabsTrigger>
              <TabsTrigger 
                value="map" 
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-purple-500/10' : ''}
              >
                Bản đồ
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                onClick={() => setViewMode('timeline')}
                className={viewMode === 'timeline' ? 'bg-purple-500/10' : ''}
              >
                Dòng thời gian
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="all">
          {viewMode === 'grid' && <MemoriesGrid />}
          {viewMode === 'map' && <MapView />}
          {viewMode === 'timeline' && <TimelineView />}
        </TabsContent>

        <TabsContent value="albums">
          <MemoriesGrid filterType="albums" />
        </TabsContent>

        <TabsContent value="favorites">
          <MemoriesGrid filterType="favorites" />
        </TabsContent>
      </Tabs>
    </div>
  );
}