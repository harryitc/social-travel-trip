'use client';

import { PostList } from './components/post-list';
import { UpcomingTrips } from '../trips/upcoming-trips';
import { TrendingDestinations } from '../explore/trending-destinations';
import { PageHeader } from '@/components/ui/page-header';
import UserWelcome from '@/components/auth/UserWelcome';

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
          <PostList />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <UpcomingTrips />
          <TrendingDestinations />
        </div>
      </div>
    </>
  );
}