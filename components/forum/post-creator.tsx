'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image as ImageIcon, MapPin, MessageCircle, XIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';

type PostCreatorProps = {
  onPostCreated: (newPost: any) => void;
};

export function PostCreator({ onPostCreated }: PostCreatorProps) {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [currentHashtag, setCurrentHashtag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddHashtag = () => {
    if (currentHashtag && !hashtags.includes(currentHashtag)) {
      setHashtags([...hashtags, currentHashtag]);
      setCurrentHashtag('');
    }
  };
  
  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would upload the file to a server
    // For demo, we'll use a placeholder image
    setImages([...images, 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=600']);
  };
  
  const handleSubmit = () => {
    if (content.trim()) {
      const newPost = {
        id: Date.now().toString(),
        author: {
          name: user?.fullName || 'Người dùng',
          avatar: user?.imageUrl || 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
        },
        content,
        images: images.length > 0 ? images : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: 'Vừa xong',
        hashtags,
      };
      
      onPostCreated(newPost);
      setContent('');
      setImages([]);
      setHashtags([]);
      setLocation('');
    }
  };
  
  return (
    <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Avatar'} />
            <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Chia sẻ trải nghiệm du lịch của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none flex-1 focus-visible:ring-purple-500 min-h-[80px]"
          />
        </div>
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative rounded-md overflow-hidden">
                {/* eslint-disable-next-line */}
                <img src={img} alt="Post" className="w-full h-32 object-cover" />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-1 right-1 h-6 w-6" 
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <div key={tag} className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md text-sm flex items-center">
                #{tag}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-5 w-5 ml-1 text-purple-700 dark:text-purple-300" 
                  onClick={() => handleRemoveHashtag(tag)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Ảnh
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Địa điểm
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {
                  const input = prompt('Nhập hashtag (không cần dấu #):');
                  if (input && !hashtags.includes(input)) {
                    setHashtags([...hashtags, input]);
                  }
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Hashtag
              </Button>
            </div>
          </div>
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Đăng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}