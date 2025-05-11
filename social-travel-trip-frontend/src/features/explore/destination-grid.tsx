'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Heart, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/radix-ui/badge';

type Destination = {
  id: string;
  title: string;
  image: string;
  location: string;
  tags: string[];
  likes: number;
  visitors: number;
};

const DEMO_DESTINATIONS: Destination[] = [
  {
    id: '1',
    title: 'Đảo Phú Quốc',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Kiên Giang',
    tags: ['Biển', 'Đảo', 'Nghỉ dưỡng'],
    likes: 1245,
    visitors: 8754,
  },
  {
    id: '2',
    title: 'Vịnh Hạ Long',
    image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Quảng Ninh',
    tags: ['Di sản', 'Vịnh', 'Biển'],
    likes: 2341,
    visitors: 12546,
  },
  {
    id: '3',
    title: 'Hội An',
    image: 'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Quảng Nam',
    tags: ['Phố cổ', 'Di sản', 'Văn hóa'],
    likes: 1876,
    visitors: 9872,
  },
  {
    id: '4',
    title: 'Đà Lạt',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Lâm Đồng',
    tags: ['Núi', 'Mát mẻ', 'Hoa'],
    likes: 1543,
    visitors: 7652,
  },
  {
    id: '5',
    title: 'Sapa',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Lào Cai',
    tags: ['Núi', 'Ruộng bậc thang', 'Dân tộc'],
    likes: 1345,
    visitors: 6543,
  },
  {
    id: '6',
    title: 'Nha Trang',
    image: 'https://images.pexels.com/photos/4428272/pexels-photo-4428272.jpeg?auto=compress&cs=tinysrgb&w=600',
    location: 'Khánh Hòa',
    tags: ['Biển', 'Đảo', 'Nghỉ dưỡng'],
    likes: 1678,
    visitors: 8976,
  },
];

export function DestinationGrid() {
  const [destinations] = useState<Destination[]>(DEMO_DESTINATIONS);
  const [likedDestinations, setLikedDestinations] = useState<string[]>([]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (likedDestinations.includes(id)) {
      setLikedDestinations(likedDestinations.filter(destId => destId !== id));
    } else {
      setLikedDestinations([...likedDestinations, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <Link href={`/explore/${destination.id}`} key={destination.id}>
          <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200 h-full group">
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line */}
              <img
                src={destination.image}
                alt={destination.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button 
                className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center ${
                  likedDestinations.includes(destination.id) 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/30 text-white hover:bg-purple-600'
                } transition-colors`}
                onClick={(e) => toggleLike(destination.id, e)}
              >
                <Heart className={`h-4 w-4 ${likedDestinations.includes(destination.id) ? 'fill-white' : ''}`} />
              </button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1 text-purple-800 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                {destination.title}
              </h3>
              
              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{destination.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {destination.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{destination.likes} lượt thích</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{destination.visitors} lượt ghé thăm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}