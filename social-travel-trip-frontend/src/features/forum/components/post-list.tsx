'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PostItem } from './post-item';
import { PostCreator } from './post-creator';
import { postService } from '../services/post.service';
import { Skeleton } from '@/components/ui/radix-ui/skeleton';
import { Post, PostQueryParams } from '../models/post.model';
import { useEventStore } from '../../stores/event.store';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PostListProps {
  searchQuery?: string;
}

export function PostList({ searchQuery = '' }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { on } = useEventStore();

  // WebSocket event listeners
  useEffect(() => {
    const handleNewPost = async () => {
      fetchPostsComplex(false);
    };

    const unsub = on('post:created', handleNewPost);
    return () => {
      unsub();
    };
  }, [on])

  // Init data
  useEffect(() => {
    fetchPostsComplex(false);
  }, []);
  
  // Handle search query changes
  useEffect(() => {
    if (searchQuery) {
      fetchPostsComplex(false);
    }
  }, [searchQuery]);

  const fetchPostsComplex = async (loadMore?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await fetchPosts(loadMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (loadMore?: boolean) => {
    const currentPage = loadMore ? page + 1 : 1;

    // Create query params based on active tab and search query
    const params: PostQueryParams = {
      page: currentPage,
      limit: 10,
      // sort_by: activeTab
    };
    
    // Add search query if provided
    if (searchQuery) {
      params.search = searchQuery;
    }

    console.log('Fetching posts with params:', params);

    // Fetch posts
    const response = await postService.getPosts(params);

    console.log('Posts response:', response);

    // Update state
    if (loadMore) {
      setPosts(prevPosts => [...prevPosts, ...response.data]);
      setPage(currentPage);
    } else {
      setPosts(response.data);
      setPage(1);
    }

    // Check if there are more posts to load
    setHasMore(response.data.length === params.limit);
  }

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      try {
        setLoading(true);
        await fetchPosts(true);
      } catch (error) {
        console.error('Error loading more posts:', error);
        setError('Có lỗi xảy ra khi tải thêm bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PostCreator />
      </motion.div>

      {loading && page === 1 ? (
        // Show skeleton loader for initial load
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              className="space-y-3 p-4 border rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
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
            </motion.div>
          ))}
        </div>
      ) : error ? (
        // Show error message
        <motion.div 
          className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
          <Button
            variant="outline"
            className="mt-2 bg-white dark:bg-gray-800"
            onClick={() => fetchPostsComplex(false)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </motion.div>
      ) : (
        // Show posts
        <div className="space-y-4">
          <AnimatePresence>
            {searchQuery && posts.length > 0 && (
              <motion.div 
                className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                Hiển thị kết quả tìm kiếm cho: <span className="font-medium">"{searchQuery}"</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.post_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PostItem post={post} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Show message if no posts are available */}
          {posts.length === 0 && (
            <motion.div 
              className="text-center py-12 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-muted-foreground mb-2">
                {searchQuery ? 
                  `Không tìm thấy bài viết nào cho "${searchQuery}"` : 
                  'Không có bài viết nào'}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-2 bg-white dark:bg-gray-800"
                  onClick={() => window.location.reload()}
                >
                  Xem tất cả bài viết
                </Button>
              )}
            </motion.div>
          )}

          {/* Load more button */}
          {hasMore && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  'Xem thêm bài viết'
                )}
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
