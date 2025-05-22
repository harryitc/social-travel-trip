'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Heart, MessageCircle, MapPin } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/radix-ui/tooltip';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/radix-ui/badge';
import { postService } from '../services/post.service';
import { Post, PostAuthor } from '../models/post.model';
import { API_ENDPOINT } from '@/config/api.config';
import CustomImage from '@/components/ui/custom-image';
import { FollowButton } from './follow-button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { notification } from 'antd';
import { PostComment } from './post-comment';
import { LikesModal } from './likes-modal';
import { postLikesAdapter } from '../services/likes-adapters';

// Reaction types
const REACTION_TYPES = [
  { id: 1, icon: '🚫', label: 'Không like' }, // reaction_id = 1
  { id: 2, icon: '👍', label: 'Thích' },
  { id: 3, icon: '❤️', label: 'Yêu thích' },
  { id: 4, icon: '😄', label: 'Haha' },
  { id: 5, icon: '😮', label: 'Wow' },
  { id: 6, icon: '😢', label: 'Buồn' },
];

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const { user: currentUser } = useAuth();

  // Determine if post is liked based on user_reaction from backend
  // user_reaction = null or 1 means "not liked", user_reaction > 1 means "liked"
  const isPostLiked = post.stats?.user_reaction && post.stats.user_reaction > 1;
  const userReactionId = post.stats?.user_reaction || null;

  const [isLiked, setIsLiked] = useState(isPostLiked || false);
  const [currentUserReaction, setCurrentUserReaction] = useState<number | null>(userReactionId);
  const [likesCount, setLikesCount] = useState(post.stats?.total_likes || 0);
  const [commentsCount] = useState(post.stats?.total_comments || 0);
  const [isHidden] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [isLiking, setIsLiking] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const reactionsMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showComments]);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionsMenuRef.current && !reactionsMenuRef.current.contains(event.target as Node)) {
        setShowReactionPicker(false);
      }
    };

    if (showReactionPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactionPicker]);

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

  const handleReaction = async (reactionId: number) => {
    if (isLiking) return; // Prevent double clicks

    try {
      setIsLiking(true);

      // Determine if this is a new reaction or removing current reaction
      const isRemovingReaction = currentUserReaction === reactionId;
      const newReactionId = isRemovingReaction ? 1 : reactionId; // 1 = no reaction

      // Update UI optimistically
      const wasLiked = currentUserReaction && currentUserReaction > 1;
      const willBeLiked = newReactionId > 1;

      setCurrentUserReaction(willBeLiked ? newReactionId : null);
      setIsLiked(willBeLiked);

      // Update like count
      if (wasLiked && !willBeLiked) {
        setLikesCount(prev => prev - 1);
      } else if (!wasLiked && willBeLiked) {
        setLikesCount(prev => prev + 1);
      }

      // Call API
      await postService.likePost(post.post_id, newReactionId);

      // Close reaction picker
      setShowReactionPicker(false);

      console.log('Post reaction updated, server will emit WebSocket event');
    } catch (error: any) {
      console.error('Error reacting to post:', error);
      notification.error({
        message: 'Lỗi',
        description: error?.response?.data?.reasons?.message || 'Không thể react bài viết. Vui lòng thử lại sau.',
        placement: 'topRight',
      });

      // Revert UI changes if API call fails
      setCurrentUserReaction(userReactionId);
      setIsLiked(isPostLiked || false);
      setLikesCount(post.stats?.total_likes || 0);
    } finally {
      setIsLiking(false);
    }
  };

  const handleLike = () => handleReaction(2); // Default like reaction

  const handleShowLikes = () => {
    if (likesCount === 0) return;
    setShowLikesModal(true);
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
          {post.author.user_id?.toString() !== currentUser?.user_id?.toString() && (
            <FollowButton
              userId={post.author.user_id.toString()}
              username={post.author.username}
              fullName={post.author.full_name}
              variant="outline"
              size="sm"
            />
          )}
          {/* <DropdownMenu>
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
          </DropdownMenu> */}
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center transition-all duration-200 ${isLiked
                          ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
                          : 'hover:text-purple-600 dark:hover:text-purple-400'
                          } ${isLiking ? 'scale-110' : ''}`}
                        onClick={handleLike}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setShowReactionPicker(!showReactionPicker);
                        }}
                        disabled={isLiking}
                      >
                        {currentUserReaction && currentUserReaction > 1 ? (
                          <span className="mr-1 text-lg">
                            {REACTION_TYPES.find(r => r.id === currentUserReaction)?.icon || '👍'}
                          </span>
                        ) : (
                          <Heart
                            className={`h-4 w-4 mr-1 transition-all duration-200 ${isLiked ? 'fill-purple-600 dark:fill-purple-400' : ''
                              } ${isLiking ? 'animate-pulse' : ''}`}
                          />
                        )}
                        <span
                          className={`cursor-pointer ${likesCount > 0 ? 'hover:underline' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowLikes();
                          }}
                        >
                          {likesCount}
                        </span>
                      </Button>

                      {/* Reaction Picker Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 px-2"
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                      >
                        <span className="text-xs">▼</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLiked ? 'Bỏ thích' : 'Thích bài viết'} • Right-click để chọn reaction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Reaction Picker */}
              {showReactionPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                  {REACTION_TYPES.filter(r => r.id > 1).map((reaction) => (
                    <button
                      key={reaction.id}
                      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${currentUserReaction === reaction.id ? 'bg-purple-100 dark:bg-purple-900' : ''
                        }`}
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
          <div className="pt-2 w-full">
            <PostComment
              postId={post.post_id.toString()}
              onCommentAdded={() => {
                // Update comments count when a new comment is added
                // This could be improved by using WebSocket events
                console.log('Comment added to post:', post.post_id);
              }}
            />
          </div>
        )}

        {/* Likes Modal */}
        <LikesModal
          isOpen={showLikesModal}
          onClose={() => setShowLikesModal(false)}
          itemId={post.post_id.toString()}
          itemType="post"
          service={postLikesAdapter}
          title="Reactions"
        />
      </CardFooter>
    </Card>
  );
}
