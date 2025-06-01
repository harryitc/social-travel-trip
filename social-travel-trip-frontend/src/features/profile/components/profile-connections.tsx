'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Input } from '@/components/ui/radix-ui/input';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Search,
  MapPin,
  Calendar,
  Star,
  Heart,
  UserCheck,
  UserX
} from 'lucide-react';

interface ProfileConnectionsProps {
  user: any;
}

// Mock connections data
const mockConnections = {
  followers: [
    {
      id: 1,
      username: 'travel_lover_99',
      full_name: 'Nguyễn Minh Anh',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      location: 'Hồ Chí Minh, Việt Nam',
      followers_count: 1234,
      mutual_friends: 5,
      is_following: false,
      joined_date: '2023-06-15'
    },
    {
      id: 2,
      username: 'adventure_seeker',
      full_name: 'Trần Văn Hùng',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Đà Nẵng, Việt Nam',
      followers_count: 856,
      mutual_friends: 12,
      is_following: true,
      joined_date: '2023-03-20'
    },
    {
      id: 3,
      username: 'photo_wanderer',
      full_name: 'Lê Thị Mai',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Hà Nội, Việt Nam',
      followers_count: 2341,
      mutual_friends: 8,
      is_following: false,
      joined_date: '2022-11-10'
    }
  ],
  following: [
    {
      id: 4,
      username: 'world_explorer',
      full_name: 'Phạm Quốc Anh',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Tokyo, Japan',
      followers_count: 5678,
      mutual_friends: 15,
      is_following: true,
      joined_date: '2021-08-05'
    },
    {
      id: 5,
      username: 'foodie_traveler',
      full_name: 'Hoàng Thị Lan',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      location: 'Seoul, South Korea',
      followers_count: 3456,
      mutual_friends: 7,
      is_following: true,
      joined_date: '2022-02-14'
    }
  ],
  suggestions: [
    {
      id: 6,
      username: 'mountain_climber',
      full_name: 'Vũ Đức Thành',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      location: 'Sapa, Lào Cai',
      followers_count: 987,
      mutual_friends: 3,
      reason: 'Có 3 bạn chung'
    },
    {
      id: 7,
      username: 'beach_lover',
      full_name: 'Ngô Thị Hương',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      location: 'Nha Trang, Khánh Hòa',
      followers_count: 1567,
      mutual_friends: 6,
      reason: 'Cùng sở thích du lịch biển'
    }
  ]
};

type TabType = 'followers' | 'following' | 'suggestions';

export function ProfileConnections({ user }: ProfileConnectionsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('followers');
  const [searchTerm, setSearchTerm] = useState('');
  const [followingStates, setFollowingStates] = useState<{[key: number]: boolean}>({});

  const handleFollow = (userId: number, currentState: boolean) => {
    setFollowingStates(prev => ({
      ...prev,
      [userId]: !currentState
    }));
  };

  const getConnectionData = () => {
    switch (activeTab) {
      case 'followers':
        return mockConnections.followers;
      case 'following':
        return mockConnections.following;
      case 'suggestions':
        return mockConnections.suggestions;
      default:
        return [];
    }
  };

  const filteredConnections = getConnectionData().filter(connection =>
    connection.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long'
    });
  };

  const tabs = [
    { id: 'followers', label: `Người theo dõi (${user.stats.followers.toLocaleString()})`, icon: Users },
    { id: 'following', label: `Đang theo dõi (${user.stats.following})`, icon: UserCheck },
    { id: 'suggestions', label: 'Gợi ý kết bạn', icon: UserPlus }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">{user.stats.followers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Người theo dõi</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">{user.stats.following}</p>
            <p className="text-sm text-gray-600">Đang theo dõi</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {Math.round((user.stats.followers / (user.stats.followers + user.stats.following)) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Tỷ lệ tương tác</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 ${
                    activeTab === tab.id ? 
                    "bg-purple-600 hover:bg-purple-700" : 
                    "hover:bg-purple-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Connections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={connection.avatar_url} alt={connection.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {connection.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <h3 className="font-semibold text-gray-900 mb-1">{connection.full_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">@{connection.username}</p>
                  
                  {/* Location */}
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{connection.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center space-x-4 mb-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{connection.followers_count.toLocaleString()}</p>
                      <p className="text-gray-600">Followers</p>
                    </div>
                    {connection.mutual_friends && (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{connection.mutual_friends}</p>
                        <p className="text-gray-600">Bạn chung</p>
                      </div>
                    )}
                  </div>

                  {/* Reason (for suggestions) */}
                  {activeTab === 'suggestions' && 'reason' in connection && (
                    <p className="text-xs text-purple-600 mb-3">{connection.reason}</p>
                  )}

                  {/* Join Date (for followers/following) */}
                  {activeTab !== 'suggestions' && 'joined_date' in connection && (
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>Tham gia {formatDate(connection.joined_date)}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {activeTab === 'suggestions' ? (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleFollow(connection.id, false)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Theo dõi
                      </Button>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant={
                            followingStates[connection.id] !== undefined 
                              ? (followingStates[connection.id] ? "outline" : "default")
                              : ('is_following' in connection && connection.is_following ? "outline" : "default")
                          }
                          className="flex-1"
                          onClick={() => handleFollow(
                            connection.id, 
                            followingStates[connection.id] !== undefined 
                              ? followingStates[connection.id]
                              : ('is_following' in connection ? connection.is_following : false)
                          )}
                        >
                          {followingStates[connection.id] !== undefined 
                            ? (followingStates[connection.id] ? <UserX className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />)
                            : ('is_following' in connection && connection.is_following ? <UserX className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />)
                          }
                          {followingStates[connection.id] !== undefined 
                            ? (followingStates[connection.id] ? "Bỏ theo dõi" : "Theo dõi")
                            : ('is_following' in connection && connection.is_following ? "Bỏ theo dõi" : "Theo dõi")
                          }
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {filteredConnections.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="px-8">
            Xem thêm
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredConnections.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600">
              Thử tìm kiếm với từ khóa khác hoặc khám phá những người dùng mới.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
