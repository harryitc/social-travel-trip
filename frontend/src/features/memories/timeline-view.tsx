'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type TimelineMemory = {
  id: string;
  image: string;
  title: string;
  location: string;
  date: Date;
  tags: string[];
  isFavorite: boolean;
  description?: string;
};

const DEMO_TIMELINE: TimelineMemory[] = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg',
    title: 'Hoàng hôn Đà Lạt',
    location: 'Đà Lạt, Lâm Đồng',
    date: new Date('2024-03-15'),
    tags: ['DaLat', 'HoangHon', 'ThienNhien'],
    isFavorite: true,
    description: 'Khoảnh khắc hoàng hôn tuyệt đẹp tại thành phố ngàn hoa.',
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg',
    title: 'Sapa mùa đông',
    location: 'Sapa, Lào Cai',
    date: new Date('2024-02-20'),
    tags: ['Sapa', 'PhuongBac', 'MuaDong'],
    isFavorite: false,
    description: 'Khám phá vẻ đẹp của Sapa trong tiết trời se lạnh.',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
    title: 'Biển Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    date: new Date('2024-01-10'),
    tags: ['PhuQuoc', 'Bien', 'MuaHe'],
    isFavorite: true,
    description: 'Những ngày nắng đẹp bên bờ biển trong xanh.',
  },
];

export function TimelineView() {
  const [memories] = useState<TimelineMemory[]>(DEMO_TIMELINE);

  const groupedMemories = memories.reduce((groups, memory) => {
    const month = format(memory.date, 'MM/yyyy', { locale: vi });
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(memory);
    return groups;
  }, {} as Record<string, TimelineMemory[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedMemories).map(([month, monthMemories]) => (
        <div key={month}>
          <h3 className="text-lg font-semibold mb-4">Tháng {month}</h3>
          <div className="space-y-6">
            {monthMemories.map((memory) => (
              <Card key={memory.id} className="relative overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                <div className="absolute top-4 left-0 w-4 h-4 rounded-full bg-purple-600 -translate-x-1/2"></div>
                <div className="absolute top-6 left-0 w-0.5 h-full bg-purple-200 dark:bg-purple-800 -translate-x-1/2"></div>
                <CardContent className="p-4 pl-8">
                  <div className="flex items-start gap-6">
                    <div className="aspect-video w-64 rounded-lg overflow-hidden shrink-0">
                      {/* eslint-disable-next-line */}
                      <img
                        src={memory.image}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-medium">{memory.title}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${memory.isFavorite ? 'text-red-500' : ''}`}
                        >
                          <Heart className={`h-4 w-4 ${memory.isFavorite ? 'fill-red-500' : ''}`} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(memory.date, 'dd/MM/yyyy', { locale: vi })}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {memory.location}
                        </div>
                      </div>
                      {memory.description && (
                        <p className="text-muted-foreground mb-3">
                          {memory.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {memory.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline"
                            className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}