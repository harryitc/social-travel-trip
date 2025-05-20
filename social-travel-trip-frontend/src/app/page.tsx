"use client";

import { ForumFeed } from "@/features/forum/components/forum-feed";
import { TrendingDestinations } from "@/features/explore/trending-destinations";
import { UpcomingTrips } from "@/features/trips/upcoming-trips";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { TabMenu } from "@/components/common/TabMenu";
import { App } from "antd";
import { catchError, map, Observable, of, switchMap, tap } from "rxjs";
import UserWelcome from "@/components/auth/UserWelcome";

export default function Home() {
  const searchParams = useSearchParams();
  const { notification } = App.useApp();

  return (
    <>
      <TabMenu />
      <div className="container mx-auto px-2 sm:px-0">
        <PageHeader
          title="Diễn đàn"
          description="Khám phá và chia sẻ trải nghiệm du lịch của bạn"
        />

        {/* Hiển thị thông tin chào mừng người dùng đã đăng nhập */}
        {/* <UserWelcome /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-2">
            <ForumFeed />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <UpcomingTrips />
            <TrendingDestinations />
          </div>
        </div>
      </div>
    </>
  );
}
