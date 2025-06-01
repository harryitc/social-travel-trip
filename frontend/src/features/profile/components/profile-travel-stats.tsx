'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Progress } from '@/components/ui/radix-ui/progress';
import { Badge } from '@/components/ui/radix-ui/badge';
import { 
  MapPin, 
  Plane, 
  Calendar, 
  Clock,
  Globe,
  Mountain,
  Camera,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';

interface ProfileTravelStatsProps {
  user: any;
}

// Mock travel data
const mockTravelData = {
  yearlyStats: [
    { year: 2024, countries: 5, cities: 12, distance: 25000 },
    { year: 2023, countries: 8, cities: 18, distance: 45000 },
    { year: 2022, countries: 6, cities: 15, distance: 35000 },
    { year: 2021, countries: 4, cities: 8, distance: 20000 }
  ],
  topDestinations: [
    { country: 'Japan', cities: 8, visits: 3, flag: '🇯🇵' },
    { country: 'Thailand', cities: 6, visits: 2, flag: '🇹🇭' },
    { country: 'South Korea', cities: 5, visits: 2, flag: '🇰🇷' },
    { country: 'Singapore', cities: 2, visits: 4, flag: '🇸🇬' },
    { country: 'Malaysia', cities: 4, visits: 1, flag: '🇲🇾' }
  ],
  travelGoals: [
    { goal: 'Visit 30 countries', current: 23, target: 30, progress: 77 },
    { goal: 'Travel 200,000 km', current: 125000, target: 200000, progress: 63 },
    { goal: 'Visit all continents', current: 4, target: 7, progress: 57 },
    { goal: 'Take 1000 photos', current: 847, target: 1000, progress: 85 }
  ],
  achievements: [
    { name: 'World Explorer', description: 'Visited 20+ countries', icon: '🌍', unlocked: true },
    { name: 'Photo Master', description: 'Shared 500+ photos', icon: '📸', unlocked: true },
    { name: 'Adventure Seeker', description: 'Completed 10+ adventures', icon: '🏔️', unlocked: true },
    { name: 'Cultural Explorer', description: 'Visited 50+ cultural sites', icon: '🏛️', unlocked: false },
    { name: 'Foodie', description: 'Tried 100+ local dishes', icon: '🍜', unlocked: true },
    { name: 'Solo Traveler', description: 'Completed 5+ solo trips', icon: '🎒', unlocked: false }
  ]
};

export function ProfileTravelStats({ user }: ProfileTravelStatsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Overview Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{user.stats.countries_visited}</p>
              <p className="text-sm text-gray-600">Quốc gia</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{user.stats.cities_visited}</p>
              <p className="text-sm text-gray-600">Thành phố</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Plane className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{(user.stats.total_distance / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-600">Km du lịch</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{user.stats.travel_days}</p>
              <p className="text-sm text-gray-600">Ngày du lịch</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yearly Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Thống kê theo năm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTravelData.yearlyStats.map((stat) => (
                  <div key={stat.year} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{stat.year}</h4>
                      <Badge variant="outline">{stat.countries} quốc gia</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Thành phố</p>
                        <p className="font-semibold">{stat.cities}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Khoảng cách</p>
                        <p className="font-semibold">{(stat.distance / 1000).toFixed(0)}K km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quốc gia</p>
                        <p className="font-semibold">{stat.countries}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Destinations */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span>Điểm đến yêu thích</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTravelData.topDestinations.map((destination, index) => (
                  <div key={destination.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{destination.flag}</span>
                      <div>
                        <p className="font-medium text-gray-900">{destination.country}</p>
                        <p className="text-sm text-gray-600">{destination.cities} thành phố</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{destination.visits} lần</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Travel Goals */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mountain className="w-5 h-5 text-purple-600" />
              <span>Mục tiêu du lịch</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTravelData.travelGoals.map((goal, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{goal.goal}</h4>
                    <span className="text-sm text-gray-600">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Thành tích du lịch</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTravelData.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">{achievement.icon}</span>
                    <h4 className={`font-semibold mb-1 ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <Badge className="mt-2 bg-yellow-500 text-white">
                        Đã mở khóa
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
