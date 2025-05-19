"use client";

import { PageHeader } from "@/components/ui/page-header";
import { TripsList } from "@/features/trips/trips-list";
import { CreateTripButton } from "@/features/trips/create-trip-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/radix-ui/tabs";
import { SearchTrips } from "@/features/trips/search-trips";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function TripsPage() {
  const searchParams = useSearchParams();

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Chuyến đi"
          description="Tạo và tham gia vào các chuyến đi"
        />
        <CreateTripButton />
      </div>

      <SearchTrips />

      <Tabs defaultValue="my-trips" className="mt-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="my-trips">Chuyến đi của tôi</TabsTrigger>
          <TabsTrigger value="joined">Đã tham gia</TabsTrigger>
          <TabsTrigger value="discover">Khám phá</TabsTrigger>
        </TabsList>
        <TabsContent value="my-trips">
          <TripsList filterType="my-trips" />
        </TabsContent>
        <TabsContent value="joined">
          <TripsList filterType="joined" />
        </TabsContent>
        <TabsContent value="discover">
          <TripsList filterType="discover" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
