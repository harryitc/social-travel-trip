'use client';

import React from 'react';
import { MapPin, Globe, Camera, Users } from 'lucide-react';
import { VIEW_360_LOCATIONS, getAllRegions, getAllCities } from './view360-locations';

interface View360StatsProps {
  className?: string;
}

export const View360Stats: React.FC<View360StatsProps> = ({ className = '' }) => {
  const totalLocations = VIEW_360_LOCATIONS.length;
  const totalRegions = getAllRegions().length;
  const totalCities = getAllCities().length;

  const stats = [
    {
      icon: MapPin,
      label: 'Địa điểm',
      value: totalLocations,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Globe,
      label: 'Vùng miền',
      value: totalRegions,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Camera,
      label: 'Thành phố',
      value: totalCities,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      label: 'Lượt xem',
      value: '10K+',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default View360Stats;
