import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Map, Plus, Search, Filter, Grid, List, BookOpen } from "lucide-react";
import MapClient from "@/features/blog/map-client";
import TravelTimeline from "@/features/blog/travel-timeline";
import { BlogBreadcrumb } from "@/features/blog/blog-breadcrumb";
import { Input } from "@/components/ui/radix-ui/input";
import { Badge } from "@/components/ui/radix-ui/badge";
import { EnhancedBlogFeed } from "@/features/blog/enhanced-blog-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/radix-ui/tabs";

export default function BlogPage() {
  return (
    <div className="w-full space-y-6">
      <BlogBreadcrumb />

      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-cyan-900/30 rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/30">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                My Travel Blog
              </h1>
              <p className="text-purple-600/80 dark:text-purple-300/80 text-lg">
                Khám phá những nơi tôi đã đến thăm
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-purple-100/80 text-purple-700 border-purple-200/50 dark:bg-purple-800/30 dark:text-purple-300 dark:border-purple-600/30">
                  📍 15 địa điểm
                </Badge>
                <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 border-blue-200/50 dark:bg-blue-800/30 dark:text-blue-300 dark:border-blue-600/30">
                  📝 23 bài viết
                </Badge>
                <Badge variant="secondary" className="bg-cyan-100/80 text-cyan-700 border-cyan-200/50 dark:bg-cyan-800/30 dark:text-cyan-300 dark:border-cyan-600/30">
                  🌍 8 quốc gia
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="text-purple-600 border-purple-300/50 hover:bg-purple-50 hover:border-purple-400 dark:text-purple-300 dark:border-purple-600/50 dark:hover:bg-purple-900/20 backdrop-blur-sm"
              >
                <Link href="/">
                  <Map className="mr-2 h-4 w-4" />
                  Bản đồ
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-blue-600 border-blue-300/50 hover:bg-blue-50 hover:border-blue-400 dark:text-blue-300 dark:border-blue-600/50 dark:hover:bg-blue-900/20 backdrop-blur-sm"
              >
                <Link href="/timeline">
                  <Clock className="mr-2 h-4 w-4" />
                  Dòng thời gian
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-400 to-blue-400 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg border-0"
              >
                <Link href="/blog/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo bài viết
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-r from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10 rounded-xl p-4 shadow-sm border border-purple-200/30 dark:border-purple-700/20">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/70" />
              <Input
                placeholder="Tìm kiếm bài viết, địa điểm..."
                className="pl-10 border-purple-200/50 focus:border-purple-300 focus:ring-purple-200/50 bg-white/80 dark:bg-gray-800/80"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-purple-200/50 text-purple-600/80 hover:bg-purple-50/80 hover:text-purple-700">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
            <div className="flex border border-purple-200/50 rounded-lg overflow-hidden bg-white/50 dark:bg-gray-800/50">
              <Button variant="ghost" size="sm" className="bg-purple-100/60 text-purple-600 hover:bg-purple-200/60">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-purple-500/80 hover:bg-purple-50/80 hover:text-purple-600">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Tabs */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-cyan-50/50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-cyan-900/10 border border-purple-200/30 dark:border-purple-700/20">
          <TabsTrigger
            value="map"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-300 data-[state=active]:to-blue-300 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-2 text-purple-600/80 hover:text-purple-700"
          >
            <Map className="h-4 w-4" />
            Bản đồ
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-300 data-[state=active]:to-cyan-300 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-2 text-blue-600/80 hover:text-blue-700"
          >
            <BookOpen className="h-4 w-4" />
            Bài viết
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-300 data-[state=active]:to-purple-300 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-2 text-cyan-600/80 hover:text-cyan-700"
          >
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Map View */}
        <TabsContent value="map" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg overflow-hidden border border-purple-200/30 dark:border-purple-700/20 backdrop-blur-sm">
              <div className="p-6 border-b border-purple-200/30 dark:border-purple-700/20 bg-gradient-to-r from-purple-50/40 via-blue-50/30 to-cyan-50/40 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-cyan-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-purple-700/90 dark:text-purple-300/90 flex items-center gap-2">
                      <Map className="h-6 w-6 text-purple-500/80" />
                      Bản đồ du lịch của tôi
                    </h2>
                    <p className="text-purple-600/70 dark:text-purple-400/70 mt-1">
                      Nhấp vào các điểm đánh dấu để xem chi tiết về chuyến đi
                    </p>
                  </div>
                  <Badge variant="outline" className="border-purple-200/50 text-purple-600/80 bg-white/60 dark:bg-gray-800/60">
                    Interactive
                  </Badge>
                </div>
              </div>
              <div className="h-[500px] sm:h-[600px] w-full relative">
                <MapClient />
                {/* Map overlay for better UX */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-purple-200/50">
                    <p className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">
                      🗺️ Khám phá hành trình
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg border border-blue-200/30 dark:border-blue-700/20 overflow-hidden backdrop-blur-sm">
              <div className="p-4 border-b border-blue-200/30 dark:border-blue-700/20 bg-gradient-to-r from-blue-50/40 via-cyan-50/30 to-purple-50/40 dark:from-blue-900/10 dark:via-cyan-900/10 dark:to-purple-900/10">
                <h3 className="text-lg font-semibold text-blue-700/90 dark:text-blue-300/90 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500/80" />
                  Dòng thời gian
                </h3>
              </div>
              <div className="p-4">
                <TravelTimeline />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Posts View */}
        <TabsContent value="posts" className="mt-6">
          <EnhancedBlogFeed />
        </TabsContent>

        {/* Timeline View */}
        <TabsContent value="timeline" className="mt-6">
          <div className="bg-gradient-to-br from-white/90 via-cyan-50/30 to-blue-50/40 dark:from-gray-900/90 dark:via-cyan-900/10 dark:to-blue-900/10 rounded-xl shadow-lg border border-cyan-200/30 dark:border-cyan-700/20 p-6 backdrop-blur-sm">
            <TravelTimeline />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
