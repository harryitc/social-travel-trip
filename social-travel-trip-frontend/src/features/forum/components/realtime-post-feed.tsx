'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/lib/providers/websocket.provider';
import { WebsocketEvent } from '@/lib/services/websocket.service';
import { Card, Avatar, Space, Typography, Button } from 'antd';
import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Post interface
interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
}

/**
 * Realtime post feed component
 * Displays posts and updates in real-time using WebSockets
 */
export const RealtimePostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { on, off, emit, isConnected } = useWebSocket();

  // Fetch initial posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // In a real implementation, this would be an API call
        // For demo purposes, we'll use mock data
        const mockPosts: Post[] = [
          {
            id: 1,
            authorId: 101,
            authorName: 'Nguyễn Văn A',
            authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            content: 'Chuyến du lịch Đà Lạt cuối tuần thật tuyệt vời! 🌲🏞️',
            createdAt: new Date().toISOString(),
            images: ['https://images.pexels.com/photos/2131614/pexels-photo-2131614.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
            likes: 12,
            comments: 3,
            isLiked: false,
          },
          {
            id: 2,
            authorId: 102,
            authorName: 'Trần Thị B',
            authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            content: 'Hôm nay tôi đã khám phá một quán cà phê tuyệt vời ở Hội An! ☕',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            images: ['https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
            likes: 8,
            comments: 2,
            isLiked: true,
          },
        ];

        setPosts(mockPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Set up WebSocket event listeners
  useEffect(() => {
    if (!isConnected) return;

    // Handler for new posts
    const handleNewPost = (data: any) => {
      const newPost: Post = {
        id: data.post.id,
        authorId: data.authorId,
        authorName: data.authorName || 'Unknown User',
        authorAvatar: data.authorAvatar,
        content: data.post.content,
        createdAt: data.post.createdAt || new Date().toISOString(),
        images: data.post.images || [],
        likes: 0,
        comments: 0,
        isLiked: false,
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    // Handler for post likes
    const handlePostLiked = (data: any) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === data.postId 
            ? { 
                ...post, 
                likes: post.isLiked ? post.likes : post.likes + 1,
                isLiked: true 
              } 
            : post
        )
      );
    };

    // Handler for post unlikes
    const handlePostUnliked = (data: any) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === data.postId 
            ? { 
                ...post, 
                likes: post.isLiked ? post.likes - 1 : post.likes,
                isLiked: false 
              } 
            : post
        )
      );
    };

    // Handler for new comments
    const handleNewComment = (data: any) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === data.postId 
            ? { ...post, comments: post.comments + 1 } 
            : post
        )
      );
    };

    // Register event handlers
    on(WebsocketEvent.POST_CREATED, handleNewPost);
    on(WebsocketEvent.POST_LIKED, handlePostLiked);
    on(WebsocketEvent.POST_UNLIKED, handlePostUnliked);
    on(WebsocketEvent.COMMENT_CREATED, handleNewComment);

    // Cleanup function
    return () => {
      off(WebsocketEvent.POST_CREATED, handleNewPost);
      off(WebsocketEvent.POST_LIKED, handlePostLiked);
      off(WebsocketEvent.POST_UNLIKED, handlePostUnliked);
      off(WebsocketEvent.COMMENT_CREATED, handleNewComment);
    };
  }, [isConnected, on, off]);

  // Handle like/unlike
  const handleLikeToggle = (postId: number, isLiked: boolean) => {
    // Update local state immediately for responsive UI
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !isLiked 
            } 
          : post
      )
    );

    // Emit WebSocket event
    emit(isLiked ? 'post:unlike' : 'post:like', { postId });
  };

  // Handle comment
  const handleComment = (postId: number) => {
    // In a real app, this would open a comment modal or navigate to a comment page
    console.log(`Open comment form for post ${postId}`);
  };

  // Handle share
  const handleShare = (postId: number) => {
    // In a real app, this would open a share modal
    console.log(`Share post ${postId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card key={post.id} className="w-full">
          <div className="flex items-start space-x-3">
            <Avatar src={post.authorAvatar} size={40}>{post.authorName[0]}</Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <Title level={5} className="m-0">{post.authorName}</Title>
                <Text type="secondary" className="text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </Text>
              </div>
              <Paragraph className="my-2">{post.content}</Paragraph>
              {post.images && post.images.length > 0 && (
                <div className="my-3">
                  <img 
                    src={post.images[0]} 
                    alt="Post" 
                    className="rounded-lg max-h-80 w-auto object-cover"
                  />
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Space>
                  <Button 
                    type="text" 
                    icon={post.isLiked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                    onClick={() => handleLikeToggle(post.id, post.isLiked)}
                  >
                    {post.likes}
                  </Button>
                  <Button 
                    type="text" 
                    icon={<MessageOutlined />}
                    onClick={() => handleComment(post.id)}
                  >
                    {post.comments}
                  </Button>
                  <Button 
                    type="text" 
                    icon={<ShareAltOutlined />}
                    onClick={() => handleShare(post.id)}
                  >
                    Share
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
