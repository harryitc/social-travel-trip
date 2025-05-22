'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/radix-ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/radix-ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/radix-ui/popover';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/radix-ui/badge';
import { postService } from '../services/post.service';
import { Post } from '../models/post.model';
import { API_ENDPOINT } from '@/config/api.config';
import CustomImage from '@/components/ui/custom-image';

// Reaction types
const REACTION_TYPES = [
  { id: 'like', icon: '👍', label: 'Thích' },
  { id: 'love', icon: '❤️', label: 'Yêu thích' },
  { id: 'haha', icon: '😄', label: 'Haha' },
  { id: 'wow', icon: '😮', label: 'Wow' },
  { id: 'sad', icon: '😢', label: 'Buồn' },
];

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const reactionsMenuRef = useRef<HTMLDivElement>(null);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return 'Vừa xong';
    } else if (diffMin < 60) {
      return `${diffMin} phút trước`;
    } else if (diffHour < 24) {
      return `${diffHour} giờ trước`;
    } else if (diffDay < 7) {
      return `${diffDay} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const handleLike = async () => {
    try {
      // Toggle like status
      const newLikedStatus = !isLiked;
      setIsLiked(newLikedStatus);
      setLikesCount(prevCount => newLikedStatus ? prevCount + 1 : prevCount - 1);

      // Call API to like/unlike post
      await postService.likePost(post.post_id);
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert UI changes if API call fails
      setIsLiked(!isLiked);
      setLikesCount(prevCount => !isLiked ? prevCount - 1 : prevCount + 1);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality
  };

  // const handleShare = () => {
  //   setShowShareOptions(!showShareOptions);
  //   // TODO: Implement share functionality
  // };

  // const handleReport = () => {
  //   setIsReported(true);
  //   // TODO: Implement report functionality
  //   alert('Cảm ơn bạn đã báo cáo bài viết này. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.');
  // };

  if (isHidden) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="px-4 py-3 flex flex-row items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.full_name} />
            <AvatarFallback>{post.author.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.full_name}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{formatDate(post.created_at)}</span>
              {post.location_name && (
                <span className="flex items-center ml-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {post.location_name.split(',')[0]}
                </span>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem
              onClick={handleSave}
              className="flex items-center cursor-pointer"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem
              onClick={handleHidePost}
              className="flex items-center cursor-pointer"
            >
              <span className="mr-2">🙈</span>
              Ẩn bài viết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleReport}
              className="flex items-center cursor-pointer text-red-500"
              disabled={isReported}
            >
              <span className="mr-2">⚠️</span>
              {isReported ? 'Đã báo cáo' : 'Báo cáo bài viết'}
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                setIsFollowing(!isFollowing);
                // Show notification
                if (isFollowing) {
                  alert(`Bạn đã bỏ theo dõi ${post.author.full_name}.`);
                } else {
                  alert(`Bạn đã bắt đầu theo dõi ${post.author.full_name}. Bạn sẽ nhận được thông báo khi họ đăng bài viết mới.`);
                }
              }}
              className="flex items-center cursor-pointer"
            >
              <span className="mr-2">{isFollowing ? '👎' : '👍'}</span>
              {isFollowing ? 'Bỏ theo dõi ' : 'Theo dõi '} {post.author.full_name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-3">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {post.images && post.images.length > 0 && (
          <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
            {post.images.map((image, index) => (
              <div
                key={index}
                className={`relative rounded-md overflow-hidden ${post.images.length === 1 ? 'col-span-1' :
                    index === 0 && post.images.length === 3 ? 'col-span-2' : 'col-span-1'
                  }`}
              >
                <CustomImage src={API_ENDPOINT.file_image_v2 + image} alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: post.images.length === 1 ? '400px' : '200px' }}
                  width={100}
                  height={100}
                ></CustomImage>
              </div>
            ))}
          </div>
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 border-t border-purple-100 dark:border-purple-900 flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="relative" ref={reactionsMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center ${isLiked ? 'text-purple-600 dark:text-purple-400' : ''}`}
                onClick={handleLike}
              >
                {currentReaction ? (
                  <span className="mr-1 text-lg">
                    {REACTION_TYPES.find(r => r.id === currentReaction)?.icon || '👍'}
                  </span>
                ) : (
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
                )}
                <span>{likesCount}</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments_count}</span>
            </Button>
            {/* <Popover open={showShareOptions} onOpenChange={setShowShareOptions}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Share className="h-4 w-4 mr-1" />
                  <span>Chia sẻ</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Đã sao chép liên kết vào clipboard');
                      setShowShareOptions(false);
                    }}
                  >
                    <span className="mr-2">🔗</span> Sao chép liên kết
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                      setShowShareOptions(false);
                    }}
                  >
                    <span className="mr-2">📱</span> Chia sẻ lên Facebook
                  </Button>
                </div>
              </PopoverContent>
            </Popover> */}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${isSaved ? 'text-purple-600 dark:text-purple-400' : ''}`}
            onClick={handleSave}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar} alt={post.author.full_name} />
                <AvatarFallback>{post.author.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  className="w-full rounded-full bg-muted px-3 py-2 text-sm"
                />
              </div>
              <Button size="sm">Gửi</Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <Button variant="link" className="p-0 h-auto">Xem tất cả {post.comments_count} bình luận</Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
