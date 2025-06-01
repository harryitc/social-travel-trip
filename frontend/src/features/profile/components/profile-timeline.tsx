'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar,
  Camera,
  Plane,
  Star,
  MoreHorizontal
} from 'lucide-react';

interface ProfileTimelineProps {
  user: any;
}

// Mock timeline data
const mockTimelineData = [
  {
    id: 1,
    type: 'post',
    content: 'Vừa có một chuyến đi tuyệt vời đến Sapa! Phong cảnh ở đây thật sự ngoạn mục. Những ruộng bậc thang xanh mướt và không khí trong lành khiến mình cảm thấy rất thư giãn. 🏔️',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop'
    ],
    location: 'Sapa, Lào Cai',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 45,
    comments: 12,
    shares: 3,
    liked: true
  },
  {
    id: 2,
    type: 'achievement',
    content: 'Đã đạt được huy hiệu "Explorer" sau khi ghé thăm 20 quốc gia! 🎉',
    badge: { name: 'Explorer', icon: '🗺️', description: 'Visited 20+ countries' },
    timestamp: '2024-01-10T14:20:00Z',
    likes: 78,
    comments: 25
  },
  {
    id: 3,
    type: 'photo',
    content: 'Sunset tại Phú Quốc - một trong những khoảnh khắc đẹp nhất mình từng chụp được! 📸',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    ],
    location: 'Phú Quốc, Kiên Giang',
    timestamp: '2024-01-05T18:45:00Z',
    likes: 156,
    comments: 34,
    shares: 12,
    liked: false
  },
  {
    id: 4,
    type: 'checkin',
    content: 'Check-in tại Tokyo Tower! Thành phố này thật sự không bao giờ ngủ 🌃',
    location: 'Tokyo Tower, Japan',
    timestamp: '2023-12-28T09:15:00Z',
    likes: 89,
    comments: 18,
    shares: 5
  }
];

export function ProfileTimeline({ user }: ProfileTimelineProps) {
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageCircle className="w-4 h-4" />;
      case 'photo': return <Camera className="w-4 h-4" />;
      case 'checkin': return <MapPin className="w-4 h-4" />;
      case 'achievement': return <Star className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-500';
      case 'photo': return 'bg-green-500';
      case 'checkin': return 'bg-purple-500';
      case 'achievement': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {mockTimelineData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {user.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                      <div className={`p-1 rounded-full ${getActivityColor(item.type)}`}>
                        {getActivityIcon(item.type)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatTimeAgo(item.timestamp)}</span>
                      {item.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
                
                {/* Achievement Badge */}
                {item.type === 'achievement' && item.badge && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{item.badge.icon}</span>
                      <div>
                        <h4 className="font-semibold text-yellow-800">{item.badge.name}</h4>
                        <p className="text-sm text-yellow-700">{item.badge.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Images */}
              {item.images && item.images.length > 0 && (
                <div className={`mb-4 grid gap-2 ${
                  item.images.length === 1 ? 'grid-cols-1' : 
                  item.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {item.images.map((image, imgIndex) => (
                    <motion.div
                      key={imgIndex}
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-lg cursor-pointer"
                    >
                      <img 
                        src={image} 
                        alt={`Post image ${imgIndex + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center space-x-2 ${
                      item.liked ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.liked ? 'fill-current' : ''}`} />
                    <span>{item.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{item.comments}</span>
                  </Button>
                  
                  {item.shares && (
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
                      <Share2 className="w-4 h-4" />
                      <span>{item.shares}</span>
                    </Button>
                  )}
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {item.type === 'post' && 'Bài viết'}
                  {item.type === 'photo' && 'Ảnh'}
                  {item.type === 'checkin' && 'Check-in'}
                  {item.type === 'achievement' && 'Thành tích'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Xem thêm hoạt động
        </Button>
      </div>
    </div>
  );
}
