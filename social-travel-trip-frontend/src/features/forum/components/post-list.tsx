'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { PostItem } from './post-item';
import { PostCreator } from './post-creator';
import { postService } from '../services/post.service';
import { Skeleton } from '@/components/ui/radix-ui/skeleton';
import { HashtagTrending } from './hashtag-trending';
import { Post, PostQueryParams } from '../models/post.model';
import { App, notification } from 'antd';
import { useEventStore } from '../../stores/event.store';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { on, emit } = useEventStore();

  // WebSocket event listeners
  useEffect(() => {
    const unsub = on('post:created', handleNewPost);
    return () => {
      unsub();
    };
  }, [on])

  // Init data
  useEffect(() => {
    fetchPostsComplex(false);
  }, []);

  // Handler for new posts
  const handleNewPost = async (data: any) => {
    fetchPosts();
  };

  // Handler for post likes
  const handlePostLiked = (data: any) => {
    // Update post likes count
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.post_id === data.postId
          ? {
            ...post,
            stats: {
              ...post.stats,
              total_likes: post.stats.total_likes + 1
            }
          }
          : post
      )
    );
  };

  // Handler for new comments
  const handleNewComment = (data: any) => {
    // Update post comments count
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.post_id === data.postId
          ? {
            ...post,
            stats: {
              ...post.stats,
              total_comments: post.stats.total_comments + 1
            }
          }
          : post
      )
    );
  };

  const fetchPostsComplex = async (loadMore?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await fetchPosts();
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (loadMore?: boolean) => {
    const currentPage = loadMore ? page + 1 : 1;

    // Create query params based on active tab
    const params: PostQueryParams = {
      page: currentPage,
      limit: 10,
      // sort_by: activeTab
    };

    // Fetch posts
    const response = await postService.getPosts(params);

    // Update state
    if (loadMore) {
      setPosts(prevPosts => [...prevPosts, ...response.data]);
      setPage(currentPage);
    } else {
      setPosts(response.data);
      setPage(1);
    }

    // Check if there are more posts to load
    setHasMore(response.data.length === 10);
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(true);
    }
  };

  return (
    <div className="space-y-6">
      <PostCreator />

      {loading && page === 1 ? (
        // Show skeleton loader for initial load
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Show error message
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => fetchPosts()}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        // Show posts
        <div className="space-y-4">
          {posts
            .map((post) => (
              <PostItem
                key={post.post_id}
                post={post}
              />
            ))}

          {/* Show message if all posts are hidden */}
          {/* {posts.length > 0 && posts.filter(post => !hiddenPosts.includes(post.post_id)).length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">Tất cả bài viết đã bị ẩn</p>
              <Button variant="outline" onClick={handleShowAllPosts}>
                Hiển thị lại tất cả bài viết
              </Button>
            </div>
          )} */}

          {/* Show message if no posts are available */}
          {posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có bài viết nào</p>
            </div>
          )}

          {/* Load more button */}
          {hasMore && posts.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem thêm'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
