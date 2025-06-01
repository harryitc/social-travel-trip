'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/radix-ui/skeleton';
import Link from 'next/link';
import { locationService, Location } from './services/location.service';

// Default images for locations without images
const DEFAULT_IMAGES = [
  'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=300',
];

export function TrendingDestinations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingLocations = async () => {
      try {
        setLoading(true);
        const trendingLocations = await locationService.getTrendingLocations(3);
        setLocations(trendingLocations);
        setError(null);
      } catch (error) {
        console.error('Error fetching trending locations:', error);
        setError('Không thể tải dữ liệu địa điểm thịnh hành');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingLocations();
  }, []);

  // Get a default image for a location
  const getDefaultImage = (index: number) => {
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-400">
          Địa điểm thịnh hành
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 pb-3 border-b border-purple-100 dark:border-purple-900 last:border-0 last:pb-0">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>{error}</p>
            <Button
              variant="link"
              className="mt-2 text-purple-600 dark:text-purple-400"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Không có địa điểm thịnh hành</p>
          </div>
        ) : (
          <div className="space-y-4">
            {locations.map((location, index) => (
              <Link href={`/explore/${location.location_id || location.city_id}`} key={location.location_id || location.city_id || index}>
                <div className="flex items-center space-x-3 pb-3 border-b border-purple-100 dark:border-purple-900 last:border-0 last:pb-0 group">
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    {/* eslint-disable-next-line */}
                    <img
                      src={location.image || getDefaultImage(index)}
                      alt={location.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {location.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {location.posts_count || 0} bài viết
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <Link href="/explore">
              <Button variant="link" size="sm" className="text-purple-600 dark:text-purple-400 p-0 h-auto w-full flex justify-center">
                <span>Khám phá tất cả địa điểm</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}