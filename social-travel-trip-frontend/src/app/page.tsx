"use client";

import { ForumFeed } from "@/features/forum/forum-feed";
import { TrendingDestinations } from "@/features/explore/trending-destinations";
import { UpcomingTrips } from "@/features/trips/upcoming-trips";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { PageHeader } from "@/components/ui/page-header";
import { getHello } from "@/features/home/abc.service";
import { notification } from "antd";
import { catchError, map, Observable, of, switchMap, tap } from "rxjs";

export default function Home() {
  const searchParams = useSearchParams();
  const { getToken } = useAuth();

  useEffect(() => {
    const subscription = of(null).pipe(
      tap(() => {
        console.log("Component calling GetToken")
      }),
      switchMap(() => getToken()),
      tap(() => {
        console.log("Component calling GetHello")
      }),
      switchMap((token) => getHello({}, token)),
      map(res => {
        return res;
      }),
      catchError(err => {
        console.log("err = ", err);
        notification.error({
          message: "Lỗi",
          description: err.message,
        });
        return [];
      })
    ).subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
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
    </>
  );
}
