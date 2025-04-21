'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ReactMarkdown from 'react-markdown';
import { PostComment } from './post-comment';
import { Badge } from '@/components/ui/badge';
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
};

export function ForumPost({ post }: ForumPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);

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
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Báo cáo bài viết</DropdownMenuItem>
            <DropdownMenuItem>Ẩn bài viết</DropdownMenuItem>
            <DropdownMenuItem>Theo dõi {post.author.name}</DropdownMenuItem>
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
          <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                {/* eslint-disable-next-line */}
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 border-t border-purple-100 dark:border-purple-900 flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="relative">
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
                <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex space-x-1">
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
            <Button variant="ghost" size="sm" className="flex items-center">
              <Share className="h-4 w-4 mr-1" />
              <span>{post.shares}</span>
            </Button>
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