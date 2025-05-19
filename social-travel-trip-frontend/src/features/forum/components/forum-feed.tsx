'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { ForumPost } from './forum-post';
import { PostCreator } from './post-creator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { HashtagTrending } from './hashtag-trending';

const DEMO_POSTS = [
  {
    id: '1',
    author: {
      name: 'Nguyễn Minh',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    },
    content: `# Hành trình khám phá Đà Lạt

Vừa trở về sau 3 ngày khám phá **Đà Lạt** - thành phố mộng mơ trong sương. Chia sẻ với mọi người một số điểm đến không thể bỏ lỡ:

- Hồ Xuân Hương
- Đồi Chè Cầu Đất
- Thung lũng Tình Yêu
- Vườn hoa Đà Lạt

Thời tiết Đà Lạt tháng 5 rất dễ chịu, nhưng các bạn nên mang theo áo khoác nhẹ vì buổi tối khá lạnh nhé!`,
    images: [
      'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/5746242/pexels-photo-5746242.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    likes: 24,
    comments: 8,
    shares: 3,
    createdAt: '2 giờ trước',
    hashtags: ['DaLat', 'DuLich', 'ViVuDaLat'],
    location: 'Đà Lạt, Lâm Đồng',
    mentions: [
      { id: '1', name: 'Lê Hoàng' },
      { id: '2', name: 'Ngọc Mai' }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Trần Thu Hà',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    },
    content: `Đã ai từng thử **cắm trại ở bãi biển Quy Nhơn** chưa? Mình vừa có trải nghiệm tuyệt vời cuối tuần qua!

Bãi biển Kỳ Co - Eo Gió thực sự là thiên đường cắm trại với cát trắng, biển xanh. Buổi tối đốt lửa trại, nướng hải sản tươi ngon và ngắm sao thật tuyệt vời.

Lưu ý cho ai muốn đi: nên chuẩn bị đầy đủ nước ngọt, đồ ăn và thuốc chống côn trùng nhé.`,
    images: [
      'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    likes: 56,
    comments: 12,
    shares: 4,
    createdAt: '5 giờ trước',
    hashtags: ['QuyNhon', 'CamTrai', 'BienDep'],
    location: 'Quy Nhơn, Bình Định'
  },
];

export function ForumFeed() {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  const handleAddPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  const handleHidePost = (postId: string) => {
    // Thêm bài viết vào danh sách ẩn
    setHiddenPosts([...hiddenPosts, postId]);

    // Lưu danh sách bài viết ẩn vào localStorage để giữ lại sau khi làm mới trang
    try {
      const storedHiddenPosts = JSON.parse(localStorage.getItem('hiddenPosts') || '[]');
      localStorage.setItem('hiddenPosts', JSON.stringify([...storedHiddenPosts, postId]));
    } catch (error) {
      console.error('Error saving hidden posts to localStorage:', error);
    }
  };

  // Load danh sách bài viết ẩn từ localStorage khi component được tải
  React.useEffect(() => {
    try {
      const storedHiddenPosts = JSON.parse(localStorage.getItem('hiddenPosts') || '[]');
      setHiddenPosts(storedHiddenPosts);
    } catch (error) {
      console.error('Error loading hidden posts from localStorage:', error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <PostCreator onPostCreated={handleAddPost} />

      <div className="flex items-center justify-between">
        <Tabs defaultValue="newest" className="w-auto">
          <TabsList>
            <TabsTrigger value="newest">Mới nhất</TabsTrigger>
            <TabsTrigger value="trending">Xu hướng</TabsTrigger>
            <TabsTrigger value="following">Đang theo dõi</TabsTrigger>
          </TabsList>
        </Tabs>

        <HashtagTrending />
      </div>

      <div className="space-y-4">
        {posts
          .filter(post => !hiddenPosts.includes(post.id)) // Lọc bỏ các bài viết đã ẩn
          .map((post) => (
            <ForumPost
              key={post.id}
              post={post}
              onHidePost={handleHidePost}
            />
          ))}

        {/* Hiển thị thông báo khi tất cả bài viết đều bị ẩn */}
        {posts.length > 0 && posts.filter(post => !hiddenPosts.includes(post.id)).length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">😎</div>
            <h3 className="text-lg font-medium mb-2">Tất cả bài viết đã được ẩn</h3>
            <p className="text-muted-foreground mb-4">Bạn đã ẩn {hiddenPosts.length} bài viết khỏi feed của mình.</p>
            <Button
              variant="outline"
              className="mt-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
              onClick={() => {
                // Xóa danh sách bài viết ẩn
                setHiddenPosts([]);
                localStorage.removeItem('hiddenPosts');
                alert('Tất cả bài viết đã được hiển thị lại.');
              }}
            >
              Hiển thị lại tất cả bài viết
            </Button>
          </div>
        )}

        {/* Hiển thị thông tin về số lượng bài viết đã ẩn nếu có */}
        {hiddenPosts.length > 0 && posts.filter(post => !hiddenPosts.includes(post.id)).length > 0 && (
          <div className="text-center py-3 px-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-muted-foreground">
            Bạn đã ẩn {hiddenPosts.length} bài viết.
            <Button
              variant="link"
              className="text-purple-600 dark:text-purple-400 p-0 h-auto text-sm ml-2"
              onClick={() => {
                setHiddenPosts([]);
                localStorage.removeItem('hiddenPosts');
                alert('Tất cả bài viết đã được hiển thị lại.');
              }}
            >
              Hiển thị lại tất cả
            </Button>
          </div>
        )}

        {posts.filter(post => !hiddenPosts.includes(post.id)).length > 0 && (
          <Button variant="outline" className="w-full">Xem thêm</Button>
        )}
      </div>
    </div>
  );
}