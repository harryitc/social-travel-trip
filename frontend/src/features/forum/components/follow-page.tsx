'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Search, Users, TrendingUp } from 'lucide-react';
import { FollowList } from './follow-list';

export function FollowPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // TODO: Implement user search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
          Mạng lưới kết nối
        </h1>
        <p className="text-muted-foreground">
          Kết nối với cộng đồng du lịch và chia sẻ những trải nghiệm tuyệt vời
        </p>
      </div>

      {/* Search Section */}
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-purple-600" />
            Tìm kiếm người dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Tìm kiếm theo tên hoặc username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">0</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Đang theo dõi</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-100 dark:border-purple-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">0</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Người theo dõi</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-100 dark:border-purple-900 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">0%</div>
            <div className="text-sm text-green-700 dark:text-green-300">Tăng trưởng tuần</div>
          </CardContent>
        </Card>
      </div>

      {/* Follow Lists */}
      <FollowList />

      {/* Suggested Users Section */}
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Gợi ý theo dõi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Tính năng gợi ý người dùng sẽ được cập nhật sớm!</p>
            <p className="text-sm mt-1">Hệ thống sẽ gợi ý những người có cùng sở thích du lịch với bạn.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
