'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { SendIcon } from 'lucide-react';

export function PostComment() {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
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

  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        author: {
          name: user?.fullName || 'Người dùng',
          avatar: user?.imageUrl || 'https://example.com/avatar.jpg',
        },
        content: comment,
        createdAt: 'Vừa xong',
      };
      
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.map((item) => (
          <div key={item.id} className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback>{item.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="bg-secondary/50 p-2 rounded-md">
                <div className="font-medium text-sm">{item.author.name}</div>
                <p className="text-sm">{item.content}</p>
              </div>
              <div className="flex space-x-4 text-xs text-muted-foreground">
                <span>{item.createdAt}</span>
                <button className="hover:text-foreground">Thích</button>
                <button className="hover:text-foreground">Trả lời</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Avatar'} />
          <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <Input
          placeholder="Viết bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1"
        />
        <Button 
          size="icon" 
          onClick={handleSubmitComment}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}