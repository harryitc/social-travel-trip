'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Input } from '@/components/ui/radix-ui/input';
import { Button } from '@/components/ui/radix-ui/button';
import { SendIcon, Heart, Reply, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/radix-ui/dropdown-menu';
import { Comment, CreateCommentPayload } from '../models/comment.model';
import { commentService } from '../services/comment.service';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { notification } from 'antd';

// Reaction types
const REACTION_TYPES = [
  { id: 1, icon: '🚫', label: 'Không like' }, // reaction_id = 1
  { id: 2, icon: '👍', label: 'Thích' },
  { id: 3, icon: '❤️', label: 'Yêu thích' },
  { id: 4, icon: '😄', label: 'Haha' },
  { id: 5, icon: '😮', label: 'Wow' },
  { id: 6, icon: '😢', label: 'Buồn' },
];

interface PostCommentProps {
  postId: string;
  onCommentAdded?: () => void;
}

export function PostComment({ postId, onCommentAdded }: PostCommentProps) {
  const { user: currentUser } = useAuth();

  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getComments(postId);
      setComments(commentsData);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      notification.error({
        message: 'Lỗi',
        description: error?.response?.data?.reasons?.message || 'Không thể tải bình luận. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      // Determine current reaction state
      const comment = comments.find(c => c.comment_id === commentId) ||
                     comments.find(c => c.replies?.find(r => r.comment_id === commentId))?.replies?.find(r => r.comment_id === commentId);

      if (!comment) return;

      const currentReaction = comment.stats.user_reaction;
      const isLiked = currentReaction && currentReaction > 1;
      const newReactionId = isLiked ? 1 : 2; // 1 = no reaction, 2 = like

      // Update UI optimistically
      setComments(comments.map(c => {
        if (c.comment_id === commentId) {
          return {
            ...c,
            stats: {
              ...c.stats,
              user_reaction: newReactionId > 1 ? newReactionId : null,
              total_likes: isLiked ? c.stats.total_likes - 1 : c.stats.total_likes + 1
            }
          };
        } else if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.comment_id === commentId) {
                return {
                  ...r,
                  stats: {
                    ...r.stats,
                    user_reaction: newReactionId > 1 ? newReactionId : null,
                    total_likes: isLiked ? r.stats.total_likes - 1 : r.stats.total_likes + 1
                  }
                };
              }
              return r;
            })
          };
        }
        return c;
      }));

      // Call API
      await commentService.likeComment(commentId, newReactionId);
    } catch (error) {
      console.error('Error liking comment:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thích bình luận. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
      // Revert changes on error
      fetchComments();
    }
  };

  const handleReplyToComment = (commentId: string, authorName: string) => {
    setReplyTo(commentId);
    setReplyingToName(authorName);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || submitting) return;

    try {
      setSubmitting(true);

      const payload = new CreateCommentPayload({
        post_id: postId,
        content: comment.trim(),
        parent_id: replyTo,
      });

      await commentService.createComment(payload);

      // Clear form
      setComment('');
      setReplyTo(null);
      setReplyingToName(null);

      // Refresh comments
      await fetchComments();

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded();
      }

      notification.success({
        message: 'Thành công',
        description: 'Bình luận đã được thêm.',
        placement: 'topRight',
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm bình luận. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  // Render a comment and its replies
  const renderComment = (item: Comment, isReply = false) => {
    const isLiked = item.stats.user_reaction && item.stats.user_reaction > 1;
    const currentReaction = item.stats.user_reaction;

    return (
      <div key={item.comment_id} className={`flex space-x-3 ${isReply ? 'ml-8 mt-3' : ''}`}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={item.author.avatar} alt={item.author.full_name} />
          <AvatarFallback>{item.author.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="bg-secondary/50 p-2 rounded-md relative group">
            <div className="flex justify-between items-start">
              <div className="font-medium text-sm">{item.author.full_name}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Báo cáo</DropdownMenuItem>
                  <DropdownMenuItem>Sao chép liên kết</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm">{item.content}</p>
          </div>
          <div className="flex space-x-4 text-xs text-muted-foreground">
            <span>{formatDate(item.created_at)}</span>
            <button
              className={`hover:text-foreground flex items-center ${isLiked ? 'text-purple-600 dark:text-purple-400' : ''}`}
              onClick={() => handleLikeComment(item.comment_id)}
            >
              {currentReaction && currentReaction > 1 ? (
                <span className="mr-1 text-sm">
                  {REACTION_TYPES.find(r => r.id === currentReaction)?.icon || '👍'}
                </span>
              ) : (
                <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
              )}
              Thích {item.stats.total_likes > 0 ? `(${item.stats.total_likes})` : ''}
            </button>
            <button
              className="hover:text-foreground flex items-center"
              onClick={() => handleReplyToComment(item.comment_id, item.author.full_name)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Trả lời
            </button>
          </div>

          {/* Render replies */}
          {item.replies && item.replies.length > 0 && (
            <div className="space-y-3 mt-3">
              {item.replies.map((reply: Comment) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.map((item) => renderComment(item))}
        {comments.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.full_name || 'Avatar'} />
          <AvatarFallback>{currentUser?.full_name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          {replyingToName && (
            <div className="absolute -top-6 left-0 text-xs text-purple-600 dark:text-purple-400">
              Trả lời {replyingToName}
              <button
                className="ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setReplyTo(null);
                  setReplyingToName(null);
                }}
              >
                Hủy
              </button>
            </div>
          )}
          <Input
            ref={inputRef}
            placeholder={replyingToName ? `Trả lời ${replyingToName}...` : "Viết bình luận..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            className="flex-1"
            disabled={submitting}
          />
        </div>
        <Button
          size="icon"
          onClick={handleSubmitComment}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!comment.trim() || submitting}
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}