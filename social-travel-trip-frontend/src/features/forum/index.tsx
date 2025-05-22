'use client';

import { PostList } from './components/post-list';
import { RealtimePostFeed } from './components/realtime-post-feed';
import { UpcomingTrips } from '../trips/upcoming-trips';
import { TrendingDestinations } from '../explore/trending-destinations';
import { PageHeader } from '@/components/ui/page-header';
import UserWelcome from '@/components/auth/UserWelcome';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';

export function ForumPage() {
  return (
    <>
      <PageHeader
        title="Diễn đàn"
        description="Khám phá và chia sẻ trải nghiệm du lịch của bạn"
      />

      {/* Hiển thị thông tin chào mừng người dùng đã đăng nhập */}
      {/* <UserWelcome /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="standard">Bài viết</TabsTrigger>
              <TabsTrigger value="realtime">Realtime (WebSocket)</TabsTrigger>
            </TabsList>
            <TabsContent value="standard">
              <PostList />
            </TabsContent>
            <TabsContent value="realtime">
              <RealtimePostFeed />
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <UpcomingTrips />
          <TrendingDestinations />
        </div>
      </div>
    </>
  );
}