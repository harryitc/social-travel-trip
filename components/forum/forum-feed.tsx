'use client';

import { useState } from 'react';
import { ForumPost } from './forum-post';
import { PostCreator } from './post-creator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const handleAddPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

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
        {posts.map((post) => (
          <ForumPost key={post.id} post={post} />
        ))}

        <Button variant="outline" className="w-full">Xem thêm</Button>
      </div>
    </div>
  );
}