"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/radix-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/radix-ui/avatar";
import { Button } from "@/components/ui/radix-ui/button";
import { Badge } from "@/components/ui/radix-ui/badge";
import {
  Heart,
  MapPin,
  Calendar,
  Share,
  MessageSquare,
  ArrowLeft,
  Eye,
  Clock,
  Bookmark,
  ThumbsUp,
  Send,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import { EmotionBadge } from "@/features/blog/EmotionBadge";
import { Separator } from "@/components/ui/radix-ui/separator";
import { Textarea } from "@/components/ui/radix-ui/textarea";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import CustomImage from "@/components/ui/custom-image";
import { API_ENDPOINT } from "@/config/api.config";
import { BlogBreadcrumb } from "@/features/blog/blog-breadcrumb";

export default function BlogDetailPage() {

  const params = useParams();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

  const [post] = useState({
    id: params.id,
    title: "Hành trình khám phá Đà Lạt trong 3 ngày 2 đêm",
    content: `# Hành trình khám phá Đà Lạt

Vừa trở về sau 3 ngày khám phá **Đà Lạt** - thành phố mộng mơ trong sương. Chia sẻ với mọi người một số điểm đến không thể bỏ lỡ:

- Hồ Xuân Hương
- Đồi Chè Cầu Đất
- Thung lũng Tình Yêu
- Vườn hoa Đà Lạt

Thời tiết Đà Lạt tháng 5 rất dễ chịu, nhưng các bạn nên mang theo áo khoác nhẹ vì buổi tối khá lạnh nhé!`,
    images: [
      "https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/5746242/pexels-photo-5746242.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    author: {
      name: "Hương Lê",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    },
    date: new Date("2024-05-22"),
    location: {
      name: "Đà Lạt, Vietnam",
      lat: 11.9404,
      lng: 108.4583,
    },
    readTime: "8 phút đọc",
    likes: 156,
    comments: [
      {
        id: "c4",
        text: "I miss Đà Lạt coffee so much! The microclimate there creates such unique flavors.",
        author: {
          name: "Michael Brown",
          avatar:
            "https://images.unsplash.com/photo-1645378999013-95abebf5f3c1",
        },
        createdAt: "2024-04-12T14:30:00Z",
      },
    ],
    shares: 45,
    tags: ["DaLat", "KhamPha", "DuLich"],
    emoji: "excited",
    createdAt: "2024-04-12T11:05:00Z",
  });

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const fullDate = format(new Date(post.createdAt), "MMMM d, yyyy");

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Would handle comment submission here if we had a backend
    setCommentText("");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full space-y-6">
      <BlogBreadcrumb title={post.title} />

      {/* Back Button and Quick Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/blog")}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại Blog
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Share className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={`border-purple-200 ${
              isSaved
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Đã lưu" : "Lưu"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs animate-scale-in">
          <div className="relative aspect-video overflow-hidden">
            <CustomImage
              width={100}
              height={100}
              src={post.images[currentImageIndex]}
              alt={post.title}
              className="h-full w-full object-cover"
            />

            {post.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {post.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-4 left-4">
              <EmotionBadge emotion={"excited"} size="lg" withLabel={true} />
            </div>

            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 p-2 rounded-full hover:bg-black/40 transition-colors text-white"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 p-2 rounded-full hover:bg-black/40 transition-colors text-white"
                >
                  →
                </button>
              </>
            )}
          </div>

          <CardContent className="p-6">
            {/* Author and Meta Info */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-purple-100 dark:ring-purple-800">
                  <AvatarImage src={API_ENDPOINT.file_image_v2 + post.author.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-purple-800 dark:text-purple-300">{post.author.name}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{formattedDate}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      1.2k views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center transition-colors ${
                    liked ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-500"
                  }`}
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current" : ""}`} />
                  <span>{liked ? post.likes + 1 : post.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-600 hover:text-purple-600"
                >
                  <ThumbsUp className="h-5 w-5 mr-1" />
                  <span>Like</span>
                </Button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            {/* Location and Date */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="flex items-center text-purple-700 dark:text-purple-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">{post.location.name}</span>
              </div>
              <div className="flex items-center text-purple-600 dark:text-purple-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{fullDate}</span>
              </div>
            </div>

            {/* <p className="text-gray-700 whitespace-pre-line mb-6">
              {post.content}
            </p> */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                // <span
                //   key={tag}
                //   className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-sm"
                // >
                //   #{tag}
                // </span>
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Location</h3>
              <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                {/* Placeholder for map */}
                <div className="flex flex-col items-center text-gray-500">
                  <MapPin className="h-8 w-8 mb-2" />
                  <span>Map view would appear here</span>
                  <span className="text-sm">{post.location.name}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Comments Section */}
            <div className="border-t border-purple-100 dark:border-purple-800 pt-6">
              <h3 className="text-xl font-bold mb-6 flex items-center text-purple-800 dark:text-purple-300">
                <MessageSquare className="h-5 w-5 mr-2" />
                Bình luận ({post.comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                  <Textarea
                    placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                    className="mb-3 border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white dark:bg-gray-900"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      💡 Hãy chia sẻ trải nghiệm hoặc câu hỏi của bạn
                    </span>
                    <Button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Gửi bình luận
                    </Button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-purple-100 dark:border-purple-800 hover:border-purple-200 dark:hover:border-purple-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9 ring-2 ring-purple-100 dark:ring-purple-800">
                          <AvatarImage src={API_ENDPOINT.file_image_v2 + comment.author.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium text-purple-800 dark:text-purple-300">
                            {comment.author.name}
                          </span>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line */}
                    <img
                      src="https://images.pexels.com/photos/5746242/pexels-photo-5746242.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Đà Lạt về đêm"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      Đà Lạt về đêm - Những trải nghiệm thú vị
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      15 phút đọc
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line */}
                    <img
                      src="https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Top quán cafe Đà Lạt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      Top 10 quán cafe view đẹp ở Đà Lạt
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      10 phút đọc
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
