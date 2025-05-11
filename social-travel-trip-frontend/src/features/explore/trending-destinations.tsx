'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const trendingDestinations = [
  {
    id: '1',
    name: 'Phú Quốc',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=300',
    posts: 142,
  },
  {
    id: '2',
    name: 'Đà Nẵng',
    image: 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=300',
    posts: 98,
  },
  {
    id: '3',
    name: 'Sapa',
    image: 'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=300',
    posts: 87,
  },
];

export function TrendingDestinations() {
  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-400">
          Địa điểm thịnh hành
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {trendingDestinations.map((destination) => (
            <Link href={`/explore/${destination.id}`} key={destination.id}>
              <div className="flex items-center space-x-3 pb-3 border-b border-purple-100 dark:border-purple-900 last:border-0 last:pb-0 group">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  {/* eslint-disable-next-line */}
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {destination.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {destination.posts} bài viết
                  </p>
                </div>
              </div>
            </Link>
          ))}
          
          <Button variant="link" size="sm" className="text-purple-600 dark:text-purple-400 p-0 h-auto w-full flex justify-center">
            <span>Khám phá tất cả địa điểm</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}