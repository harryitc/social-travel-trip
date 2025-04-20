'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const upcomingTrips = [
  {
    id: '1',
    title: 'Khám phá Đà Lạt',
    location: 'Đà Lạt, Lâm Đồng',
    date: '15/06/2025 - 18/06/2025',
    members: [
      { src: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Nguyễn Minh' },
      { src: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Trần Hà' },
      { src: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Lê Hoàng' },
    ],
  },
  {
    id: '2',
    title: 'Biển Nha Trang',
    location: 'Nha Trang, Khánh Hòa',
    date: '22/07/2025 - 26/07/2025',
    members: [
      { src: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Ngọc Mai' },
      { src: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Nguyễn Minh' },
    ],
  },
];

export function UpcomingTrips() {
  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-400">
          Chuyến đi sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="flex items-start space-x-3 pb-3 border-b border-purple-100 dark:border-purple-900 last:border-0 last:pb-0">
              <div className="flex flex-col flex-1 space-y-1">
                <Link href={`/trips/${trip.id}`}>
                  <h4 className="font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {trip.title}
                  </h4>
                </Link>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{trip.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{trip.date}</span>
                </div>
                <div className="flex -space-x-2 mt-1">
                  {trip.members.map((member, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.src} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="link" size="sm" className="text-purple-600 dark:text-purple-400 p-0 h-auto w-full flex justify-center">
            <span>Xem tất cả chuyến đi</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}