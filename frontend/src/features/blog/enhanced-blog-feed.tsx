"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MapPin,
  Calendar,
  Eye,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/radix-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/radix-ui/avatar";
import { Button } from "@/components/ui/radix-ui/button";
import { Badge } from "@/components/ui/radix-ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/radix-ui/tabs";
import { EmotionBadge } from "./EmotionBadge";

// Demo data with enhanced properties
const DEMO_POSTS = [
  {
    id: "1",
    title: "Hành trình khám phá Đà Lạt trong 3 ngày 2 đêm",
    excerpt: "Chia sẻ về hành trình khám phá thành phố mộng mơ Đà Lạt với những trải nghiệm thú vị và ẩm thực đặc sắc.",
    coverImage: "https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600",
    author: {
      name: "Nguyễn Minh",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1",
    },
    emotion: "peaceful",
    date: "22/05/2025",
    readTime: "8 phút đọc",
    likes: 124,
    comments: 23,
    shares: 12,
    views: 1250,
    location: { name: "Đà Lạt, Việt Nam" },
    tags: ["DaLat", "KhamPha", "DuLich"],
    featured: true,
  },
  {
    id: "2",
    title: "Khám phá vẻ đẹp hoang sơ của Phú Quốc",
    excerpt: "Những bãi biển tuyệt đẹp và làng chài yên bình tại đảo ngọc Phú Quốc.",
    coverImage: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600",
    author: {
      name: "Trần Linh",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1",
    },
    emotion: "excited",
    date: "18/05/2025",
    readTime: "6 phút đọc",
    likes: 89,
    comments: 15,
    shares: 8,
    views: 890,
    location: { name: "Phú Quốc, Việt Nam" },
    tags: ["PhuQuoc", "Bien", "DaoNgoc"],
    featured: false,
  },
  {
    id: "3",
    title: "Sapa mùa lúa chín - Thiên đường vàng ươm",
    excerpt: "Ruộng bậc thang Sapa trong mùa lúa chín tạo nên một bức tranh thiên nhiên tuyệt đẹp.",
    coverImage: "https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=600",
    author: {
      name: "Lê Hương",
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1",
    },
    emotion: "amazed",
    date: "15/05/2025",
    readTime: "10 phút đọc",
    likes: 156,
    comments: 31,
    shares: 18,
    views: 1680,
    location: { name: "Sapa, Việt Nam" },
    tags: ["Sapa", "RuongBacThang", "MuaLua"],
    featured: true,
  }
];

export function EnhancedBlogFeed() {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const toggleLike = (id: string) => {
    setLikedPosts(prev =>
      prev.includes(id) ? prev.filter(postId => postId !== id) : [...prev, id]
    );
  };

  const toggleSave = (id: string) => {
    setSavedPosts(prev =>
      prev.includes(id) ? prev.filter(postId => postId !== id) : [...prev, id]
    );
  };

  const filteredPosts = () => {
    switch (activeTab) {
      case "trending":
        return DEMO_POSTS.sort((a, b) => b.views - a.views);
      case "featured":
        return DEMO_POSTS.filter(post => post.featured);
      case "saved":
        return DEMO_POSTS.filter(post => savedPosts.includes(post.id));
      default:
        return DEMO_POSTS;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-cyan-50/50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-cyan-900/10 border border-purple-200/30 dark:border-purple-700/20">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-300/80 data-[state=active]:to-blue-300/80 data-[state=active]:text-white text-purple-600/80 hover:text-purple-700"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-300/80 data-[state=active]:to-cyan-300/80 data-[state=active]:text-white flex items-center gap-1 text-blue-600/80 hover:text-blue-700"
          >
            <TrendingUp className="h-3 w-3" />
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="featured"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-300/80 data-[state=active]:to-purple-300/80 data-[state=active]:text-white text-cyan-600/80 hover:text-cyan-700"
          >
            Nổi bật
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-300/80 data-[state=active]:to-pink-300/80 data-[state=active]:text-white text-purple-600/80 hover:text-purple-700"
          >
            Đã lưu
          </TabsTrigger>
        </TabsList>

        {/* Posts Grid */}
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts().map((post) => (
              <Card
                key={post.id}
                className="group h-full overflow-hidden border-purple-200/30 dark:border-purple-700/20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm hover:shadow-xl hover:border-purple-300/50 dark:hover:border-purple-600/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Link href={`/blog/${post.id}`}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Overlays */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <EmotionBadge emotion={post.emotion} />
                    {post.featured && (
                      <Badge className="bg-gradient-to-r from-purple-300/90 to-blue-300/90 text-white border-0 backdrop-blur-sm">
                        ⭐ Nổi bật
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-black/40 text-white border-0 backdrop-blur-sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views.toLocaleString()}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-8 w-8 ring-2 ring-purple-200/50 dark:ring-purple-700/30">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="bg-purple-100/60 text-purple-600/80 dark:bg-purple-900/30 dark:text-purple-300/80">
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-purple-700/90 dark:text-purple-300/90 truncate">
                        {post.author.name}
                      </p>
                      <div className="flex items-center text-xs text-purple-600/70 dark:text-purple-400/70">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600/90 dark:group-hover:text-purple-300/90 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600/80 dark:text-gray-400/80 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-3 w-3 text-purple-400/80" />
                    <span className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">
                      {post.location.name}
                    </span>
                    <span className="text-xs text-gray-400/60">•</span>
                    <Clock className="h-3 w-3 text-blue-400/80" />
                    <span className="text-xs text-blue-600/70 dark:text-blue-400/70">{post.readTime}</span>
                  </div>
                </CardHeader>

                {/* Actions Section */}
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`h-8 px-2 ${
                          likedPosts.includes(post.id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>

                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-purple-600">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>

                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-600">
                        <Share className="h-4 w-4 mr-1" />
                        {post.shares}
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(post.id)}
                      className={`h-8 px-2 ${
                        savedPosts.includes(post.id)
                          ? "text-purple-600 hover:text-purple-700"
                          : "text-gray-500 hover:text-purple-600"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${savedPosts.includes(post.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts().length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Bookmark className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "saved" ? "Bạn chưa lưu bài viết nào" : "Không tìm thấy bài viết phù hợp"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
