'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, MessageCircle, Share, Bookmark, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
};

const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Hành trình khám phá Đà Lạt trong 3 ngày 2 đêm',
    excerpt: 'Chia sẻ về hành trình khám phá thành phố mộng mơ Đà Lạt với những trải nghiệm thú vị và ẩm thực đặc sắc. Cùng mình khám phá các địa điểm nổi tiếng và bí quyết để có chuyến đi trọn vẹn.',
    coverImage: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: {
      name: 'Nguyễn Minh',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    },
    date: '22/05/2025',
    readTime: '8 phút đọc',
    likes: 124,
    comments: 32,
    shares: 45,
    tags: ['DaLat', 'KhamPha', 'DuLich'],
  },
  {
    id: '2',
    title: 'Kinh nghiệm phượt Sapa tự túc cho người mới bắt đầu',
    excerpt: 'Bài viết chia sẻ kinh nghiệm đi Sapa tự túc từ cách đặt phòng, di chuyển đến các địa điểm nên ghé thăm. Những lưu ý quan trọng cho chuyến đi hoàn hảo.',
    coverImage: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: {
      name: 'Trần Thu Hà',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    },
    date: '15/04/2025',
    readTime: '10 phút đọc',
    likes: 98,
    comments: 24,
    shares: 37,
    tags: ['Sapa', 'Phuot', 'KinhNghiem'],
  },
  {
    id: '3',
    title: 'Top 5 bãi biển đẹp nhất Việt Nam phải ghé thăm một lần trong đời',
    excerpt: 'Khám phá những bãi biển tuyệt đẹp của Việt Nam từ Bắc vào Nam. Bài viết giới thiệu chi tiết về vẻ đẹp, đặc trưng và những hoạt động thú vị tại mỗi bãi biển.',
    coverImage: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: {
      name: 'Lê Hoàng',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    },
    date: '03/06/2025',
    readTime: '12 phút đọc',
    likes: 156,
    comments: 47,
    shares: 63,
    tags: ['Bien', 'Top5', 'DuLich'],
  },
];

export function BlogFeed() {
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  
  const toggleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };
  
  const toggleSave = (id: string) => {
    if (savedPosts.includes(id)) {
      setSavedPosts(savedPosts.filter(postId => postId !== id));
    } else {
      setSavedPosts([...savedPosts, id]);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="following">Đang theo dõi</TabsTrigger>
          <TabsTrigger value="saved">Đã lưu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id}>
                <Card className="h-full overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                  <div className="aspect-video relative">
                    {/* eslint-disable-next-line */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {post.date}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-purple-800 dark:text-purple-400 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-purple-100 dark:border-purple-900 mt-2 flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => { e.preventDefault(); toggleLike(post.id); }}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => { e.preventDefault(); toggleSave(post.id); }}
                      >
                        <Bookmark className={`h-4 w-4 ${savedPosts.includes(post.id) ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400' : ''}`} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="following" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Theo dõi các tác giả để xem các bài viết của họ tại đây.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.filter(post => savedPosts.includes(post.id)).map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <Card className="h-full overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                    <div className="aspect-video relative">
                      {/* eslint-disable-next-line */}
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{post.author.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-purple-800 dark:text-purple-400 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 border-t border-purple-100 dark:border-purple-900 mt-2 flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => { e.preventDefault(); toggleLike(post.id); }}
                        >
                          <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => { e.preventDefault(); toggleSave(post.id); }}
                        >
                          <Bookmark className={`h-4 w-4 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400`} />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có bài viết nào được lưu.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button variant="outline" className="border-purple-200 dark:border-purple-800">
          Xem thêm
        </Button>
      </div>
    </div>
  );
}