"use client";

import { PageHeader } from "@/components/ui/page-header";
import { TripsList } from "@/features/trips/trips-list";
import { CreateTripButton } from "@/features/trips/create-trip-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/radix-ui/tabs";
import { SearchTrips } from "@/features/trips/search-trips";
import { TabMenu } from "@/components/common/TabMenu";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function TripsPage() {
  const searchParams = useSearchParams();

  return (
    <>
      <TabMenu />
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <PageHeader
            title="Chuyến đi"
            description="Tạo và tham gia vào các chuyến đi"
          />
          <div className="flex justify-end">
            <CreateTripButton />
          </div>
        </div>

        <SearchTrips />

        <Tabs defaultValue="my-trips" className="mt-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="my-trips">Chuyến đi của tôi</TabsTrigger>
            <TabsTrigger value="joined">Đã tham gia</TabsTrigger>
            <TabsTrigger value="discover">Khám phá</TabsTrigger>
          </TabsList>
          <TabsContent value="my-trips" className="mt-4">
            <TripsList filterType="my-trips" />
          </TabsContent>
          <TabsContent value="joined" className="mt-4">
            <TripsList filterType="joined" />
          </TabsContent>
          <TabsContent value="discover" className="mt-4">
            <TripsList filterType="discover" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
