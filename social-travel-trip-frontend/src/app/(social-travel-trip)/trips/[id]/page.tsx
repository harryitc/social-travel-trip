'use client';

import { useState } from 'react';
import { TripChatLayout } from '@/features/trips/TripChatLayout';
import { useParams } from 'next/navigation';

export default function TripPage() {

  const params = useParams();

  const [trip] = useState({
    id: params.id as string,
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
    <div className="w-full overflow-hidden">
      <div className="h-[calc(100vh-7rem)]">
        <TripChatLayout initialTripId={trip.id} />
      </div>
    </div>
  );
}