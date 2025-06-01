'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { 
  Camera, 
  Edit, 
  MapPin, 
  Calendar, 
  Globe, 
  Verified,
  Settings,
  Share2,
  MessageCircle
} from 'lucide-react';

interface ProfileHeaderProps {
  user: any;
  isOwnProfile?: boolean;
}

export function ProfileHeader({ user, isOwnProfile = true }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="relative">
      {/* Cover Photo */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-80 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-b-3xl overflow-hidden"
      >
        {user.cover_url ? (
          <img 
            src={user.cover_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600" />
        )}
        
        {/* Cover overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Cover actions */}
        {isOwnProfile && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 right-6"
          >
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <Camera className="w-4 h-4 mr-2" />
              Đổi ảnh bìa
            </Button>
          </motion.div>
        )}

        {/* Profile info overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            {user.verified && (
              <Verified className="w-6 h-6 text-blue-400 fill-current" />
            )}
          </div>
          <p className="text-white/90 text-lg">@{user.username}</p>
          <div className="flex items-center space-x-4 mt-2 text-white/80">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Tham gia {formatJoinDate(user.joined_date)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile Avatar & Actions */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative -mt-20 bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-4xl font-bold">
                  {user.full_name?.charAt(0) || user.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && (
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-purple-600 hover:bg-purple-700"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.full_name}
                  </h2>
                  <p className="text-gray-600 mb-3">@{user.username}</p>
                  
                  {user.bio && (
                    <p className="text-gray-700 max-w-2xl mb-4">
                      {user.bio}
                    </p>
                  )}

                  {/* Quick Info */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                    {user.website && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  {isOwnProfile ? (
                    <>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={handleFollow}
                        className={`${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Nhắn tin
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Badges */}
              {user.badges && user.badges.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-2 mt-4"
                >
                  {user.badges.slice(0, 4).map((badge: any) => (
                    <Badge 
                      key={badge.id} 
                      variant="secondary" 
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                    >
                      <span className="mr-1">{badge.icon}</span>
                      {badge.name}
                    </Badge>
                  ))}
                  {user.badges.length > 4 && (
                    <Badge variant="outline">
                      +{user.badges.length - 4} khác
                    </Badge>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
