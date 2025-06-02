'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/radix-ui/card';
import {
  Users,
  FileText,
  Heart,
  MapPin,
  Camera,
  Plane,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface ProfileStatsProps {
  user: any;
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    {
      label: 'Bài viết',
      value: user.stats.posts,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12 tuần này'
    },
    {
      label: 'Người theo dõi',
      value: user.stats.followers.toLocaleString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+89 tuần này'
    },
    {
      label: 'Đang theo dõi',
      value: user.stats.following,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      change: '+5 tuần này'
    },
    {
      label: 'Quốc gia',
      value: user.stats.countries_visited,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2 năm nay'
    },
    {
      label: 'Thành phố',
      value: user.stats.cities_visited,
      icon: Camera,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+8 năm nay'
    },
    {
      label: 'Km du lịch',
      value: `${(user.stats.total_distance / 1000).toFixed(0)}K`,
      icon: Plane,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+15K năm nay'
    }
  ];

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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;

        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
