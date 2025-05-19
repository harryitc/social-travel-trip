'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, Heart, Reply, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/radix-ui/dropdown-menu';

type CommentType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
  replies?: CommentType[];
  replyTo?: string;
};

export function PostComment() {
  const user = {
    fullName: 'Đức Anh',
    imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
  };
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: '1',
      author: {
        name: 'Lê Hoàng',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      content: 'Đẹp quá! Mình cũng đang lên kế hoạch đi Đà Lạt tháng tới.',
      createdAt: '10 phút trước',
    },
    {
      id: '2',
      author: {
        name: 'Ngọc Mai',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      content: 'Có ai biết chi phí cho chuyến đi này khoảng bao nhiêu không?',
      createdAt: '15 phút trước',
    },
  ]);

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const isLiked = c.isLiked || false;
        const likes = c.likes || 0;
        return {
          ...c,
          isLiked: !isLiked,
          likes: isLiked ? likes - 1 : likes + 1
        };
      } else if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === commentId) {
              const isLiked = r.isLiked || false;
              const likes = r.likes || 0;
              return {
                ...r,
                isLiked: !isLiked,
                likes: isLiked ? likes - 1 : likes + 1
              };
            }
            return r;
          })
        };
      }
      return c;
    }));
  };

  const handleReplyToComment = (commentId: string, authorName: string) => {
    setReplyTo(commentId);
    setReplyingToName(authorName);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment: CommentType = {
        id: Date.now().toString(),
        author: {
          name: user?.fullName || 'Người dùng',
          avatar: user?.imageUrl || 'https://example.com/avatar.jpg',
        },
        content: comment,
        createdAt: 'Vừa xong',
        likes: 0,
        isLiked: false,
      };

      if (replyTo) {
        // Add as a reply to an existing comment
        setComments(comments.map(c => {
          if (c.id === replyTo) {
            return {
              ...c,
              replies: [...(c.replies || []), {...newComment, replyTo}]
            };
          }
          return c;
        }));
        setReplyTo(null);
        setReplyingToName(null);
      } else {
        // Add as a new top-level comment
        setComments([...comments, newComment]);
      }

      setComment('');
    }
  };

  // Render a comment and its replies
  const renderComment = (item: CommentType, isReply = false) => {
    return (
      <div key={item.id} className={`flex space-x-3 ${isReply ? 'ml-8 mt-3' : ''}`}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={item.author.avatar} alt={item.author.name} />
          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="bg-secondary/50 p-2 rounded-md relative group">
            <div className="flex justify-between items-start">
              <div className="font-medium text-sm">{item.author.name}</div>
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
            <span>{item.createdAt}</span>
            <button
              className={`hover:text-foreground flex items-center ${item.isLiked ? 'text-purple-600 dark:text-purple-400' : ''}`}
              onClick={() => handleLikeComment(item.id)}
            >
              <Heart className={`h-3 w-3 mr-1 ${item.isLiked ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
              Thích {item.likes && item.likes > 0 ? `(${item.likes})` : ''}
            </button>
            <button
              className="hover:text-foreground flex items-center"
              onClick={() => handleReplyToComment(item.id, item.author.name)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Trả lời
            </button>
          </div>

          {/* Render replies */}
          {item.replies && item.replies.length > 0 && (
            <div className="space-y-3 mt-3">
              {item.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.map((item) => renderComment(item))}
      </div>

      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Avatar'} />
          <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
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
            className="flex-1"
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
    </div>
  );
}