'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
import { PostComment } from './post-comment';
import { Badge } from '@/components/ui/radix-ui/badge';
import { REACTION_TYPES } from './mock-data';

type ForumPostProps = {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    images?: string[];
    likes: number;
    comments: number;
    shares: number;
    createdAt: string;
    hashtags?: string[];
    location?: string;
    mentions?: {id: string, name: string}[];
  };
  onHidePost?: (postId: string) => void;
};

export function ForumPost({ post, onHidePost }: ForumPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.shares);

  // Refs for click outside detection
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const reactionsMenuRef = useRef<HTMLDivElement>(null);

  // Function to handle sharing and increment share count
  const handleShare = (platform: string) => {
    // Increment share count
    setSharesCount(sharesCount + 1);

    // Close share menu
    setShowShareOptions(false);

    // Show confirmation
    alert(`Bài viết đã được chia sẻ lên ${platform}!`);
  };

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close share options when clicking outside
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }

      // Close reactions menu when clicking outside
      if (reactionsMenuRef.current && !reactionsMenuRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReaction = (reactionType: string) => {
    // If clicking the same reaction, toggle it off
    if (currentReaction === reactionType && isLiked) {
      setLikesCount(likesCount - 1);
      setIsLiked(false);
      setCurrentReaction(null);
    } else {
      // If changing reaction type, don't decrease count
      if (!isLiked) {
        setLikesCount(likesCount + 1);
      }
      setIsLiked(true);
      setCurrentReaction(reactionType);
    }
    setShowReactions(false);
  };

  // For backward compatibility
  const handleLike = () => {
    if (showReactions) {
      setShowReactions(false);
      return;
    }
    setShowReactions(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="px-4 py-3 flex flex-row items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.name}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{post.createdAt}</span>
              {post.location && (
                <span className="flex items-center ml-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {post.location.split(',')[0]}
                </span>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                setIsReported(!isReported);
                // Hiển thị thông báo đã báo cáo
                if (!isReported) {
                  alert(`Đã báo cáo bài viết của ${post.author.name}. Chúng tôi sẽ xem xét báo cáo của bạn.`);
                }
              }}
              className="flex items-center cursor-pointer"
            >
              <span className="mr-2">🚩</span>
              {isReported ? 'Đã báo cáo bài viết' : 'Báo cáo bài viết'}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                // Hiển thị hộp thoại xác nhận trước khi ẩn bài viết
                if (window.confirm(`Bạn có chắc chắn muốn ẩn bài viết của ${post.author.name}? Bạn sẽ không thấy bài viết này trong feed của mình nữa.`)) {
                  setIsHidden(true);
                  // Gọi hàm callback để thông báo cho component cha
                  if (onHidePost) {
                    onHidePost(post.id);
                  }
                  // Hiển thị thông báo đã ẩn
                  alert(`Đã ẩn bài viết của ${post.author.name}. Bạn có thể hiển thị lại tất cả bài viết ẩn bằng cách nhấn vào nút "Hiển thị lại tất cả bài viết" ở cuối trang.`);
                }
              }}
              className="flex items-center cursor-pointer"
            >
              <span className="mr-2">👀</span>
              {isHidden ? 'Đã ẩn bài viết' : 'Ẩn bài viết'}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setIsFollowing(!isFollowing);
                // Hiển thị thông báo đã theo dõi/bỏ theo dõi
                if (isFollowing) {
                  alert(`Bạn đã bỏ theo dõi ${post.author.name}.`);
                } else {
                  alert(`Bạn đã bắt đầu theo dõi ${post.author.name}. Bạn sẽ nhận được thông báo khi họ đăng bài viết mới.`);
                }
              }}
              className="flex items-center cursor-pointer"
            >
              <span className="mr-2">{isFollowing ? '👎' : '👍'}</span>
              {isFollowing ? 'Bỏ theo dõi ' : 'Theo dõi '} {post.author.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-3">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>

          {post.mentions && post.mentions.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span>Đề cập đến: </span>
              {post.mentions.map((mention, index) => (
                <span key={mention.id} className="text-purple-600 dark:text-purple-400 font-medium">
                  @{mention.name}{index < post.mentions!.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="space-y-2">
            <div className={`grid gap-2 ${post.images.length > 1 ? (post.images.length > 2 ? 'grid-cols-3' : 'grid-cols-2') : 'grid-cols-1'}`}>
              {post.images.slice(0, post.images.length > 4 ? 4 : post.images.length).map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-md overflow-hidden ${post.images && post.images.length > 2 && index === 0 ? 'col-span-full row-span-2 aspect-video' : 'aspect-square'}`}
                >
                  {/* eslint-disable-next-line */}
                  <img
                    src={image}
                    alt={`Ảnh bài viết ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {post.images && post.images.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xl font-medium">+{post.images.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

              {showReactions && (
                <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex space-x-1 z-10 animate-in fade-in slide-in-from-bottom-5 duration-200">
                  {REACTION_TYPES.map((reaction) => (
                    <button
                      key={reaction.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
                      onClick={() => handleReaction(reaction.id)}
                      title={reaction.label}
                    >
                      <span className="text-lg">{reaction.icon}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments}</span>
            </Button>
            <div className="relative" ref={shareMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center hover:text-purple-600 dark:hover:text-purple-400 ${showShareOptions ? 'text-purple-600 dark:text-purple-400' : ''}`}
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share className="h-4 w-4 mr-1" />
                <span>{sharesCount}</span>
              </Button>

              {showShareOptions && (
                <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-2 w-64 z-10 animate-in fade-in slide-in-from-top-5 duration-200">
                  <div className="text-sm font-medium mb-2 px-2">Chia sẻ bài viết</div>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://example.com/post/${post.id}`);
                        alert('Liên kết đã được sao chép vào clipboard!');
                        setShowShareOptions(false);
                        setSharesCount(sharesCount + 1);
                      }}
                    >
                      <span className="mr-2">📋</span>
                      Sao chép liên kết
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=https://example.com/post/${post.id}`, '_blank');
                        handleShare('Facebook');
                      }}
                    >
                      <span className="mr-2">👥</span>
                      Chia sẻ lên Facebook
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=https://example.com/post/${post.id}&text=${encodeURIComponent(`Check out this post by ${post.author.name}`)}`, '_blank');
                        handleShare('Twitter');
                      }}
                    >
                      <span className="mr-2">🕊️</span>
                      Chia sẻ lên Twitter
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={() => {
                        const emailBody = `Kiểm tra bài viết này từ ${post.author.name}: https://example.com/post/${post.id}`;
                        window.open(`mailto:?subject=Chia sẻ bài viết từ TripTribe&body=${encodeURIComponent(emailBody)}`, '_blank');
                        handleShare('Email');
                      }}
                    >
                      <span className="mr-2">✉️</span>
                      Chia sẻ qua Email
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
          <div className="w-full border-t border-purple-100 dark:border-purple-900 pt-3 space-y-3">
            <PostComment />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}