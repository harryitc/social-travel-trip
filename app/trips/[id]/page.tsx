'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { TripChat } from '@/components/trips/trip-chat';
import { TripDetails } from '@/components/trips/trip-details';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TripPage({ params }: { params: { id: string } }) {
  const [trip] = useState({
    id: params.id,
    title: 'Khám phá Đà Lạt',
    description: 'Cùng nhau khám phá thành phố sương mù với những địa điểm nổi tiếng và ẩm thực đặc sắc.',
    location: 'Đà Lạt, Lâm Đồng',
    date: '15/06/2025 - 18/06/2025',
    duration: '4 ngày 3 đêm',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    members: {
      count: 5,
      max: 10,
      list: [
        { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
        { id: '2', name: 'Trần Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
        { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1' },
      ],
    },
    hashtags: ['DaLat', 'DuLich', 'NhomDuLich'],
    isPrivate: false,
  });

  return (
    <div className="container mx-auto">
      <PageHeader 
        title={trip.title}
        description={trip.description}
      />
      
      <Tabs defaultValue="chat" className="mt-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="chat">Trò chuyện</TabsTrigger>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-6">
          <TripChat tripId={trip.id} members={trip.members.list} />
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <TripDetails trip={trip} />
        </TabsContent>
      </Tabs>
    </div>
  );
}