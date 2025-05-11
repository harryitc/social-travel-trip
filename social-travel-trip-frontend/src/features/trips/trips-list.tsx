'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Calendar, MapPin, Users, ArrowRight, Lock, Globe } from 'lucide-react';
import Link from 'next/link';

type Trip = {
  id: string;
  title: string;
  image: string;
  description: string;
  members: {
    count: number;
    max: number;
    avatars: { src: string; name: string }[];
  };
  location: string;
  date: string;
  duration: string;
  hashtags: string[];
  isPrivate: boolean;
};

const DEMO_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Khám phá Đà Lạt',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Cùng nhau khám phá thành phố sương mù với những địa điểm nổi tiếng và ẩm thực đặc sắc.',
    members: {
      count: 5,
      max: 10,
      avatars: [
        { src: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Nguyễn Minh' },
        { src: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Trần Hà' },
        { src: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Lê Hoàng' },
      ],
    },
    location: 'Đà Lạt, Lâm Đồng',
    date: '15/06/2025 - 18/06/2025',
    duration: '4 ngày 3 đêm',
    hashtags: ['DaLat', 'DuLich', 'NhomDuLich'],
    isPrivate: false,
  },
  {
    id: '2',
    title: 'Biển Nha Trang',
    image: 'https://images.pexels.com/photos/4428272/pexels-photo-4428272.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Chuyến đi biển Nha Trang cùng các hoạt động lặn biển, tham quan đảo và nghỉ dưỡng.',
    members: {
      count: 8,
      max: 12,
      avatars: [
        { src: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Ngọc Mai' },
        { src: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Nguyễn Minh' },
        { src: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Trần Hà' },
      ],
    },
    location: 'Nha Trang, Khánh Hòa',
    date: '22/07/2025 - 26/07/2025',
    duration: '5 ngày 4 đêm',
    hashtags: ['NhaTrang', 'Bien', 'DuLich'],
    isPrivate: true,
  },
  {
    id: '3',
    title: 'Sapa mùa đông',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Chinh phục đỉnh Fansipan và khám phá các bản làng dân tộc thiểu số ở Sapa trong mùa đông.',
    members: {
      count: 6,
      max: 15,
      avatars: [
        { src: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Lê Hoàng' },
        { src: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', name: 'Ngọc Mai' },
      ],
    },
    location: 'Sapa, Lào Cai',
    date: '20/12/2025 - 24/12/2025',
    duration: '5 ngày 4 đêm',
    hashtags: ['Sapa', 'MuaDong', 'Fansipan'],
    isPrivate: false,
  },
];

type TripsListProps = {
  filterType: 'my-trips' | 'joined' | 'discover';
};

export function TripsList({ filterType }: TripsListProps) {
  const [trips] = useState<Trip[]>(DEMO_TRIPS);
  
  const filteredTrips = trips.filter(trip => {
    if (filterType === 'my-trips') {
      return true; // In a real app, filter by created by current user
    } else if (filterType === 'joined') {
      return true; // In a real app, filter by trips the user has joined
    } else {
      return true; // Discover shows all public trips
    }
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
      {filteredTrips.map((trip) => (
        <Link href={`/trips/${trip.id}`} key={trip.id}>
          <Card className="h-full overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
            <div className="aspect-video relative">
              {/* eslint-disable-next-line */}
              <img
                src={trip.image}
                alt={trip.title}
                className="object-cover w-full h-full"
              />
              {trip.isPrivate && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Riêng tư
                  </Badge>
                </div>
              )}
              {!trip.isPrivate && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-500 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Công khai
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-400">{trip.title}</CardTitle>
              <CardDescription className="line-clamp-2">{trip.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div>{trip.date}</div>
                  <div className="text-xs text-muted-foreground">{trip.duration}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{trip.members.count}/{trip.members.max} thành viên</span>
              </div>
              
              <div className="flex -space-x-2">
                {trip.members.avatars.map((member, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={member.src} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {trip.members.count > trip.members.avatars.length && (
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs border-2 border-background">
                    +{trip.members.count - trip.members.avatars.length}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {trip.hashtags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400">
                <span className="flex-1">Xem chi tiết</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}