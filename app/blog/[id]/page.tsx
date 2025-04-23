'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { PostComment } from '@/components/forum/post-comment';

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [post] = useState({
    id: params.id,
    title: 'Hành trình khám phá Đà Lạt trong 3 ngày 2 đêm',
    content: `# Hành trình khám phá Đà Lạt

Vừa trở về sau 3 ngày khám phá **Đà Lạt** - thành phố mộng mơ trong sương. Chia sẻ với mọi người một số điểm đến không thể bỏ lỡ:

- Hồ Xuân Hương
- Đồi Chè Cầu Đất
- Thung lũng Tình Yêu
- Vườn hoa Đà Lạt

Thời tiết Đà Lạt tháng 5 rất dễ chịu, nhưng các bạn nên mang theo áo khoác nhẹ vì buổi tối khá lạnh nhé!`,
    images: [
      'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5746242/pexels-photo-5746242.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    author: {
      name: 'Nguyễn Minh',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120',
    },
    date: new Date('2024-05-22'),
    location: 'Đà Lạt, Lâm Đồng',
    readTime: '8 phút đọc',
    likes: 124,
    comments: 32,
    shares: 45,
    tags: ['DaLat', 'KhamPha', 'DuLich'],
    emoji: '😊',
  });

  return (
    <div className="container mx-auto">
      <PageHeader 
        title={post.title}
        description={`Được viết bởi ${post.author.name}`}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(post.date, 'dd/MM/yyyy', { locale: vi })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {post.location}
                </Badge>
                {post.emoji && (
                  <span className="text-2xl">{post.emoji}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {post.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg overflow-hidden aspect-video"
                >
                  {/* eslint-disable-next-line */}
                  <img
                    src={image}
                    alt={`${post.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="p-6 border-t border-purple-100 dark:border-purple-900 flex flex-col space-y-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center ${isLiked ? 'text-purple-600 dark:text-purple-400' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
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
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>{post.shares}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center ${isSaved ? 'text-purple-600 dark:text-purple-400' : ''}`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-purple-600 dark:fill-purple-400' : ''}`} />
              </Button>
            </div>

            {showComments && (
              <div className="w-full border-t border-purple-100 dark:border-purple-900 pt-4">
                <PostComment />
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line */}
                    <img
                      src="https://images.pexels.com/photos/5746242/pexels-photo-5746242.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Đà Lạt về đêm"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Đà Lạt về đêm - Những trải nghiệm thú vị</h4>
                    <p className="text-sm text-muted-foreground mt-1">15 phút đọc</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line */}
                    <img
                      src="https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Top quán cafe Đà Lạt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Top 10 quán cafe view đẹp ở Đà Lạt</h4>
                    <p className="text-sm text-muted-foreground mt-1">10 phút đọc</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}