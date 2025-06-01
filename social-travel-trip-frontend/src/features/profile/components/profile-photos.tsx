'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { 
  Camera, 
  Heart, 
  MessageCircle, 
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';

interface ProfilePhotosProps {
  user: any;
}

// Mock photos data
const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    title: 'Ruộng bậc thang Sapa',
    location: 'Sapa, Lào Cai',
    date: '2024-01-15',
    likes: 45,
    comments: 12,
    category: 'Landscape'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
    title: 'Sunset Phú Quốc',
    location: 'Phú Quốc, Kiên Giang',
    date: '2024-01-05',
    likes: 156,
    comments: 34,
    category: 'Sunset'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop',
    title: 'Hội An Ancient Town',
    location: 'Hội An, Quảng Nam',
    date: '2023-12-20',
    likes: 89,
    comments: 18,
    category: 'Architecture'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=300&fit=crop',
    title: 'Hạ Long Bay',
    location: 'Hạ Long, Quảng Ninh',
    date: '2023-11-28',
    likes: 234,
    comments: 56,
    category: 'Nature'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300&h=300&fit=crop',
    title: 'Tokyo Night',
    location: 'Tokyo, Japan',
    date: '2023-12-28',
    likes: 178,
    comments: 42,
    category: 'Cityscape'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    title: 'Mountain Adventure',
    location: 'Swiss Alps',
    date: '2023-10-15',
    likes: 312,
    comments: 78,
    category: 'Adventure'
  }
];

const categories = ['All', 'Landscape', 'Sunset', 'Architecture', 'Nature', 'Cityscape', 'Adventure'];

export function ProfilePhotos({ user }: ProfilePhotosProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredPhotos = selectedCategory === 'All' 
    ? mockPhotos 
    : mockPhotos.filter(photo => photo.category === selectedCategory);

  const openLightbox = (photo: any, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{mockPhotos.length}</p>
            <p className="text-sm text-gray-600">Ảnh đã chia sẻ</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {mockPhotos.reduce((sum, photo) => sum + photo.likes, 0)}
            </p>
            <p className="text-sm text-gray-600">Lượt thích</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {mockPhotos.reduce((sum, photo) => sum + photo.comments, 0)}
            </p>
            <p className="text-sm text-gray-600">Bình luận</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {new Set(mockPhotos.map(photo => photo.location)).size}
            </p>
            <p className="text-sm text-gray-600">Địa điểm</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-purple-600 hover:bg-purple-700" : 
                  "hover:bg-purple-50"
                }
              >
                {category === 'All' ? 'Tất cả' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence>
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer"
              onClick={() => openLightbox(photo, index)}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <img 
                  src={photo.thumbnail} 
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-medium text-sm">{photo.title}</p>
                    <div className="flex items-center space-x-3 text-xs mt-1">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{photo.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{photo.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={prevPhoto}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={nextPhoto}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Image */}
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-lg">
                <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedPhoto.date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{selectedPhoto.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{selectedPhoto.comments}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
