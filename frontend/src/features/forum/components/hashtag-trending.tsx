'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/radix-ui/dropdown-menu';
import { TrendingUp, Loader2 } from 'lucide-react';
import { locationService } from '@/features/explore/services/location.service';

export function HashtagTrending() {
  const [trendingHashtags, setTrendingHashtags] = useState<{ tag: string, posts: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        setLoading(true);
        const hashtags = await locationService.getTrendingHashtags(undefined, 10);
        setTrendingHashtags(hashtags);
        setError(null);
      } catch (error) {
        console.error('Error fetching trending hashtags:', error);
        setError('Không thể tải dữ liệu hashtag thịnh hành');
        // Fallback to default hashtags
        setTrendingHashtags([
          { tag: 'DuLichVietNam', posts: 1205 },
          { tag: 'PhuQuoc', posts: 954 },
          { tag: 'DaNang', posts: 862 },
          { tag: 'SaPa', posts: 743 },
          { tag: 'HaLong', posts: 628 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingHashtags();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400">
          <TrendingUp className="h-4 w-4 mr-2" />
          Xu hướng
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <h3 className="font-medium mb-2">Hashtag thịnh hành</h3>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            </div>
          ) : error ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              {error}
            </div>
          ) : trendingHashtags.length === 0 ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              Không có hashtag thịnh hành
            </div>
          ) : (
            trendingHashtags.map((item) => (
              <DropdownMenuItem key={item.tag} className="cursor-pointer">
                <div className="flex justify-between w-full">
                  <span>#{item.tag}</span>
                  <span className="text-muted-foreground text-xs">{item.posts} bài viết</span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}