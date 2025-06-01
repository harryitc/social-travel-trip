'use client';

import { useEffect, useState } from 'react';
import {
  ProfileHeader,
  ProfileStats,
  ProfileTabs,
  ProfileAbout,
  ProfileTimeline,
  ProfilePhotos,
  ProfileTravelStats,
  ProfileConnections
} from '@/features/profile';
import { motion } from 'framer-motion';

// Mock data for demonstration
const mockUserProfile = {
  user_id: 1,
  username: 'traveler_duc',
  full_name: 'Nguyễn Đức Anh',
  email: 'ducanh@example.com',
  phone_number: '+84 123 456 789',
  date_of_birth: '1995-05-15',
  gender: true,
  address: 'Hà Nội, Việt Nam',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  cover_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
  bio: 'Passionate traveler exploring the world one destination at a time. Love photography, local cuisine, and meeting new people. Always planning the next adventure! 🌍✈️',
  location: 'Hanoi, Vietnam',
  website: 'https://travelblog.example.com',
  joined_date: '2020-01-15',
  verified: true,
  stats: {
    posts: 156,
    followers: 2847,
    following: 892,
    countries_visited: 23,
    cities_visited: 67,
    total_distance: 125000, // km
    travel_days: 245
  },
  badges: [
    { id: 1, name: 'Explorer', icon: '🗺️', description: 'Visited 20+ countries' },
    { id: 2, name: 'Photographer', icon: '📸', description: 'Shared 100+ photos' },
    { id: 3, name: 'Foodie', icon: '🍜', description: 'Tried 50+ local dishes' },
    { id: 4, name: 'Adventure Seeker', icon: '🏔️', description: 'Completed 10+ adventures' }
  ],
  interests: ['Photography', 'Hiking', 'Local Cuisine', 'Cultural Sites', 'Beach', 'Mountains', 'History', 'Art'],
  languages: ['Vietnamese', 'English', 'Japanese', 'Korean'],
  travel_style: ['Backpacking', 'Cultural', 'Adventure', 'Photography'],
  created_at: '2020-01-15T00:00:00Z',
  updated_at: new Date().toISOString()
};

type TabType = 'about' | 'timeline' | 'photos' | 'travel-stats' | 'connections';

/**
 * Trang hồ sơ cá nhân hoành tráng
 */
export default function ProfilePage() {
  const [user, setUser] = useState(mockUserProfile);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('about');

  useEffect(() => {
    // Có thể load data từ API ở đây sau
    // fetchUserProfile();
  }, []);

  const tabs = [
    { id: 'about', label: 'Giới thiệu', icon: '👤' },
    { id: 'timeline', label: 'Hoạt động', icon: '📝' },
    { id: 'photos', label: 'Ảnh', icon: '📸' },
    { id: 'travel-stats', label: 'Thống kê du lịch', icon: '📊' },
    { id: 'connections', label: 'Kết nối', icon: '👥' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <ProfileAbout user={user} />;
      case 'timeline':
        return <ProfileTimeline user={user} />;
      case 'photos':
        return <ProfilePhotos user={user} />;
      case 'travel-stats':
        return <ProfileTravelStats user={user} />;
      case 'connections':
        return <ProfileConnections user={user} />;
      default:
        return <ProfileAbout user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="animate-pulse">
          <div className="h-80 bg-gray-300 rounded-b-3xl"></div>
          <div className="container mx-auto px-4 -mt-20">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-64"></div>
                  <div className="h-4 bg-gray-300 rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
    >
      {/* Profile Header with Cover Photo */}
      <ProfileHeader user={user} />

      {/* Profile Stats */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <ProfileStats user={user} />
      </div>

      {/* Profile Navigation Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId: string) => setActiveTab(tabId as TabType)}
        />
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 mt-8 pb-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}
