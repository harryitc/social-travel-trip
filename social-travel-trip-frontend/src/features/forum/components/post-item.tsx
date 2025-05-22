'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Heart, MessageCircle, MoreHorizontal, Bookmark, MapPin, SendIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/radix-ui/dropdown-menu';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/radix-ui/badge';
import { postService } from '../services/post.service';
import { Post } from '../models/post.model';
import { API_ENDPOINT } from '@/config/api.config';
import CustomImage from '@/components/ui/custom-image';
import { FollowButton } from './follow-button';

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
  // Determine if post is liked based on stats
  const isPostLiked = post.stats?.reactions?.some(r => r.reaction_id === 1) || false;
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(isPostLiked);
  const [likesCount, setLikesCount] = useState(post.stats?.total_likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.stats?.total_comments || 0);
  const [isHidden, setIsHidden] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const reactionsMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showComments])

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

      // WebSocket event will be emitted by server after like operation
      console.log('Post liked/unliked, server will emit WebSocket event');
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert UI changes if API call fails
      setIsLiked(!isLiked);
      setLikesCount(prevCount => !isLiked ? prevCount - 1 : prevCount + 1);
    }
  };

  const handleSubmitComment = () => {

  };

  // const handleSave = () => {
  //   setIsSaved(!isSaved);
  //   // TODO: Implement save functionality
  // };

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
              {post.location && post.location.name && (
                <span className="flex items-center ml-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {post.location.name.split(',')[0]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FollowButton
            userId={post.author.user_id.toString()}
            username={post.author.username}
            fullName={post.author.full_name}
            variant="outline"
            size="sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Bookmark className="h-4 w-4 mr-2" />
                Lưu bài viết
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <span className="mr-2">🙈</span>
                Ẩn bài viết
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer text-red-500">
                <span className="mr-2">⚠️</span>
                Báo cáo bài viết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              <span>{commentsCount}</span>
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
          {/* <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${isSaved ? 'text-purple-600 dark:text-purple-400' : ''}`}
            onClick={handleSave}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
          </Button> */}
        </div>

        {showComments && (

          <div className="space-y-4 pt-2 w-full">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar} alt={post.author.full_name} />
                <AvatarFallback>{post.author.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                {/* <Input
                placeholder={replyingToName ? `Trả lời ${replyingToName}...` : "Viết bình luận..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
              /> */}
                <input
                  ref={inputRef}
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="w-full rounded-full bg-muted px-3 py-2 text-sm"
                />
              </div>
              <Button
                size="icon"
                onClick={handleSubmitComment}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!comment.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <Button variant="link" className="p-0 h-auto">Xem tất cả {commentsCount} bình luận</Button>
            </div>
          </div>

          // <div className="space-y-4 pt-2">
          //   <div className="flex items-center space-x-2">
          //     <Avatar className="h-8 w-8">
          //       <AvatarImage src={post.author.avatar} alt={post.author.full_name} />
          //       <AvatarFallback>{post.author.full_name?.charAt(0)}</AvatarFallback>
          //     </Avatar>
          //     <div className="flex-1">
          //       <input
          //         type="text"
          //         placeholder="Viết bình luận..."
          //         className="w-full rounded-full bg-muted px-3 py-2 text-sm"
          //       />
          //     </div>
          //     <Button size="sm">Gửi</Button>
          //   </div>
          //   <div className="text-center text-sm text-muted-foreground">
          //     <Button variant="link" className="p-0 h-auto">Xem tất cả {commentsCount} bình luận</Button>
          //   </div>
          // </div>
        )}
      </CardFooter>
    </Card>
  );
}
