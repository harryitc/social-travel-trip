'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, X, Mouse, Smartphone, Search, Eye } from 'lucide-react';

interface View360TipsProps {
  className?: string;
}

export const View360Tips: React.FC<View360TipsProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  const tips = [
    {
      icon: Mouse,
      title: 'Điều khiển chuột',
      description: 'Kéo thả để xoay góc nhìn, cuộn chuột để zoom in/out'
    },
    {
      icon: Smartphone,
      title: 'Trên mobile',
      description: 'Vuốt để xoay, chạm hai ngón tay để zoom'
    },
    {
      icon: Search,
      title: 'Tìm kiếm nhanh',
      description: 'Sử dụng thanh tìm kiếm để nhanh chóng tìm địa điểm'
    },
    {
      icon: Eye,
      title: 'Chế độ toàn màn hình',
      description: 'Nhấn nút toàn màn hình để có trải nghiệm tốt nhất'
    }
  ];

  if (!isVisible) return null;

  return (
    <Card className={`border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Mẹo sử dụng View 360°
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
              >
                <div className="p-1 bg-amber-200 dark:bg-amber-800 rounded">
                  <Icon className="h-3 w-3 text-amber-700 dark:text-amber-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {tip.title}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default View360Tips;
