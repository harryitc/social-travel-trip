'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/radix-ui/card';
import { motion } from 'framer-motion';
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
import { formatPostTimestamp, formatPostDetailedTimestamp } from '@/lib/utils';

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
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showComments]);

  // Functions to handle reaction menu hover behavior
  const handleShowReactions = () => {
    // Clear any existing timeout
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }
    setShowReactionPicker(true);
  };

  const handleHideReactions = () => {
    // Set a timeout to hide the reactions after a delay
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }
    reactionTimeoutRef.current = setTimeout(() => {
      setShowReactionPicker(false);
    }, 300); // 300ms delay before hiding
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

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

  // Format date using dayjs utility
  // Removed old formatDate function - now using formatPostTimestamp from utils

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
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700">
      <CardHeader className="px-4 py-3 flex flex-row items-start justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar className="border-2 border-purple-100 dark:border-purple-900 ring-2 ring-white dark:ring-gray-900">
            <AvatarImage src={API_ENDPOINT.file_image_v2 + post.author.avatar} alt={post.author.full_name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {post.author.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{post.author.full_name}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {formatPostTimestamp(post.created_at)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatPostDetailedTimestamp(post.created_at)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {post.location && post.location.name && (
                <span className="flex items-center ml-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <MapPin className="h-3 w-3 mr-1" />
                  {post.location.name.split(',')[0]}
                </span>
              )}
            </div>
          </div>
        </motion.div>
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
        <motion.div 
          className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-purple-900 dark:prose-headings:text-purple-300 prose-a:text-purple-600 dark:prose-a:text-purple-400 hover:prose-a:text-purple-700 dark:hover:prose-a:text-purple-300"
          initial={{ opacity: 0.9 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </motion.div>

        {post.images && post.images.length > 0 && (
          <motion.div 
            className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {post.images.map((image, index) => (
              <motion.div
                key={index}
                className={`relative rounded-md overflow-hidden ${post.images.length === 1 ? 'col-span-1' :
                  index === 0 && post.images.length === 3 ? 'col-span-2' : 'col-span-1'
                  }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <CustomImage 
                  src={API_ENDPOINT.file_image_v2 + image} 
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover hover:brightness-105 transition-all duration-300"
                  style={{ maxHeight: post.images.length === 1 ? '400px' : '200px' }}
                  width={800}
                  height={600}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {post.hashtags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <Badge 
                  variant="outline" 
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  #{tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 border-t border-purple-100 dark:border-purple-900 flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="relative" ref={reactionsMenuRef}>
              <div 
                className="flex items-center"
                onMouseEnter={handleShowReactions}
                onMouseLeave={handleHideReactions}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center transition-all duration-200 ${isLiked
                    ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
                    : 'hover:text-purple-600 dark:hover:text-purple-400'
                    } ${isLiking ? 'scale-110' : ''}`}
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  {currentUserReaction && currentUserReaction > 1 ? (
                    <span className="mr-1 text-lg">
                      {REACTION_TYPES.find(r => r.id === currentUserReaction)?.icon || '👍'}
                    </span>
                  ) : (
                    <Heart
                      className={`h-4 w-4 mr-1 transition-all duration-200 ${isLiked ? 'fill-purple-600 dark:fill-purple-400' : ''}
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
              </div>

              {/* Reaction Picker - Now shows on hover with delay before hiding */}
              <motion.div 
                className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex gap-1 z-10"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ 
                  opacity: showReactionPicker ? 1 : 0,
                  y: showReactionPicker ? 0 : 10,
                  scale: showReactionPicker ? 1 : 0.95
                }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: showReactionPicker ? 'auto' : 'none' }}
                onMouseEnter={handleShowReactions}
                onMouseLeave={handleHideReactions}
              >
                {REACTION_TYPES.filter(r => r.id > 1).map((reaction) => (
                  <motion.button
                    key={reaction.id}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${currentUserReaction === reaction.id ? 'bg-purple-100 dark:bg-purple-900' : ''}
                      }`}
                    onClick={() => handleReaction(reaction.id)}
                    title={reaction.label}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-lg">{reaction.icon}</span>
                  </motion.button>
                ))}
              </motion.div>
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
