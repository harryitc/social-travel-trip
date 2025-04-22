'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MapPin, 
  Calendar,
  MoreHorizontal,
  Lock,
  Globe,
  Users,
  Pencil,
  Trash,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type Memory = {
  id: string;
  image: string;
  title: string;
  location: string;
  date: Date;
  tags: string[];
  privacy: 'public' | 'friends' | 'private';
  isFavorite: boolean;
  type: 'photo' | 'album';
  metadata?: {
    size: string;
    resolution: string;
  };
};

type MemoriesGridProps = {
  filterType?: 'all' | 'albums' | 'favorites';
};

const DEMO_MEMORIES: Memory[] = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg',
    title: 'Hoàng hôn Đà Lạt',
    location: 'Đà Lạt, Lâm Đồng',
    date: new Date('2024-03-15'),
    tags: ['DaLat', 'HoangHon', 'ThienNhien'],
    privacy: 'public',
    isFavorite: true,
    type: 'photo',
    metadata: {
      size: '2.4 MB',
      resolution: '3840 x 2160',
    },
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg',
    title: 'Album Sapa 2024',
    location: 'Sapa, Lào Cai',
    date: new Date('2024-02-20'),
    tags: ['Sapa', 'PhuongBac', 'MuaDong'],
    privacy: 'friends',
    isFavorite: false,
    type: 'album',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
    title: 'Biển Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    date: new Date('2024-01-10'),
    tags: ['PhuQuoc', 'Bien', 'MuaHe'],
    privacy: 'private',
    isFavorite: true,
    type: 'photo',
    metadata: {
      size: '3.1 MB',
      resolution: '4096 x 2730',
    },
  },
];

export function MemoriesGrid({ filterType = 'all' }: MemoriesGridProps) {
  const [memories, setMemories] = useState<Memory[]>(DEMO_MEMORIES);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setMemories(memories.map(memory => 
      memory.id === id ? { ...memory, isFavorite: !memory.isFavorite } : memory
    ));
  };

  const filteredMemories = memories.filter(memory => {
    if (filterType === 'albums') return memory.type === 'album';
    if (filterType === 'favorites') return memory.isFavorite;
    return true;
  });

  const getPrivacyIcon = (privacy: Memory['privacy']) => {
    switch (privacy) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'friends':
        return <Users className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
    }
  };

  const getPrivacyText = (privacy: Memory['privacy']) => {
    switch (privacy) {
      case 'public':
        return 'Công khai';
      case 'friends':
        return 'Bạn bè';
      case 'private':
        return 'Riêng tư';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredMemories.map((memory) => (
        <Card key={memory.id} className="group overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
          <div className="relative aspect-square">
            {/* eslint-disable-next-line */}
            <img
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg mb-1">{memory.title}</h3>
              <div className="flex items-center text-sm space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{memory.location}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex items-center space-x-2">
              <Badge variant={memory.privacy === 'public' ? 'default' : 'secondary'} className="flex items-center gap-1">
                {getPrivacyIcon(memory.privacy)}
                <span className="text-xs">{getPrivacyText(memory.privacy)}</span>
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {format(memory.date, 'dd/MM/yyyy', { locale: vi })}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleFavorite(memory.id)}
              >
                <Heart className={`h-4 w-4 ${memory.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                  #{tag}
                </Badge>
              ))}
            </div>
            {memory.metadata && (
              <div className="mt-2 text-xs text-muted-foreground">
                <div>{memory.metadata.resolution}</div>
                <div>{memory.metadata.size}</div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}