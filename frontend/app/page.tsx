'use client';

import { ForumFeed } from "@/components/forum/forum-feed";
import { TrendingDestinations } from "@/components/explore/trending-destinations";
import { UpcomingTrips } from "@/components/trips/upcoming-trips";
import { PageHeader } from "@/components/ui/page-header";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const { getToken } = useAuth();

  const getUser = async () => {
    console.log("fetching API...");
    const token = await getToken();
    const url = "http://localhost:3000/api/";
    const params: any = {};
    if (token) {
      Object.assign(params, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }
    try {
      const res = await axios.get("http://localhost:3000/api", params);
      console.log("Data = ", res);
    } catch (err: any) {
      console.log("loi roi ne: ", err);
    }
  };

  useEffect(() => {
    getUser();
  }, [searchParams]);

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Diễn đàn"
        description="Khám phá và chia sẻ trải nghiệm du lịch của bạn"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ForumFeed />
        </div>
        <div className="space-y-6">
          <UpcomingTrips />
          <TrendingDestinations />
        </div>
      </div>
    </div>
  );
}
