import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Map, Plus } from "lucide-react";
import MapClient from "@/features/blog/map-client";
import TravelTimeline from "@/features/blog/travel-timeline";

export default function BlogPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-emerald-600 text-white p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Travel Blog</h1>
              <p className="text-emerald-100">
                Khám phá những nơi tôi đã đến thăm
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                className="text-white border-white hover:bg-emerald-700"
              >
                <Link href="/">
                  <Map className="mr-2 h-4 w-4" />
                  Bản đồ
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-white border-white hover:bg-emerald-700"
              >
                <Link href="/timeline">
                  <Clock className="mr-2 h-4 w-4" />
                  Dòng thời gian
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="bg-white text-emerald-600 hover:bg-emerald-50"
              >
                <Link href="/blog/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo bài viết
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold text-emerald-700">
              Bản đồ du lịch của tôi
            </h2>
            <p className="text-gray-600">
              Nhấp vào các điểm đánh dấu để xem chi tiết về chuyến đi
            </p>
          </div>
          <div className="h-[600px] w-full">
            <MapClient />
          </div>
        </div>
        <div className="">
          <TravelTimeline />
        </div>
      </div>
    </main>
  );
}
