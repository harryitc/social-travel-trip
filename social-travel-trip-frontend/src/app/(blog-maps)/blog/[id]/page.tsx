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
    <div className="container mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push("/blog")}
        className="mb-6 flex items-center hover:bg-black/40 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Feed
      </Button>

      <PageHeader
        title={post.title}
        description={`Được viết bởi ${post.author.name}`}
      />

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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={API_ENDPOINT.file_image_v2 + post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center ${
                    liked ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-5 w-5 mr-1 ${liked ? "fill-current" : ""}`}
                  />
                  <span>{liked ? post.likes + 1 : post.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-600"
                >
                  <Share className="h-5 w-5 mr-1" />
                  <span>Share</span>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3">{post.title}</h2>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-travel-blue" />
                <span>{post.location.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-travel-orange" />
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

            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments ({post.comments.length})
              </h3>

              <form onSubmit={handleSubmitComment} className="mb-6">
                <Textarea
                  placeholder="Add your comment..."
                  className="mb-2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  // className={`flex items-center ${isSaved ? 'text-purple-600 dark:text-purple-400' : ''}`}
                  onClick={() => setIsSaved(!isSaved)}
                  type="submit"
                  disabled={!commentText.trim()}
                >
                  {/* <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-purple-600 dark:fill-purple-400' : ''}`} /> */}
                  Post Comment
                </Button>
              </form>

              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={API_ENDPOINT.file_image_v2 + comment.author.avatar} />
                          <AvatarFallback>
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {comment.author.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
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
