'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Heart, MapPin, Users, Calendar, Star, Share2, Bookmark, Camera } from 'lucide-react';
// import { Map as MapGL, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParams } from 'next/navigation';

type Review = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  date: string;
  images?: string[];
};

export default function DestinationPage() {

  const params = useParams();

  const [destination] = useState({
    id: params.id,
    name: 'Phú Quốc',
    description: `Phú Quốc - hòn đảo thiên đường với bãi biển cát trắng mịn, nước biển trong xanh và những khu resort sang trọng. Đây là điểm đến lý tưởng cho những ai yêu thích biển, muốn tận hưởng kỳ nghỉ thư giãn hoặc khám phá văn hóa địa phương.

Những điểm tham quan nổi bật:
- Bãi Sao với cát trắng mịn
- Hòn Thơm với cáp treo vượt biển
- Suối Tranh với thác nước trong lành
- Làng chài Hàm Ninh
- Vườn tiêu Phú Quốc
- Nhà thùng nước mắm

Thời điểm lý tưởng để đến Phú Quốc là từ tháng 11 đến tháng 4 năm sau, khi thời tiết khô ráo và nắng đẹp.`,
    location: 'Kiên Giang',
    coordinates: [103.9567, 10.2896],
    images: [
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    tags: ['Biển', 'Đảo', 'Nghỉ dưỡng', 'Ẩm thực', 'Hoàng hôn'],
    rating: 4.8,
    reviews: 1245,
    visitors: 8754,
    weather: {
      current: 'Nắng nhẹ',
      temperature: '28°C',
      humidity: '75%'
    },
    bestTimeToVisit: 'Tháng 11 - Tháng 4',
    activities: [
      'Tắm biển',
      'Lặn ngắm san hô',
      'Câu cá',
      'Thăm làng chài',
      'Khám phá đảo hoang',
      'Thưởng thức hải sản'
    ]
  });

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      user: {
        name: 'Nguyễn Minh',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120'
      },
      rating: 5,
      content: 'Phú Quốc thực sự là một thiên đường! Bãi biển tuyệt đẹp, nước trong vắt. Đặc biệt là hoàng hôn ở Sunset Beach Bar thật không thể quên.',
      date: '2 ngày trước',
      images: [
        'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600'
      ]
    },
    {
      id: '2',
      user: {
        name: 'Thu Hà',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120'
      },
      rating: 4,
      content: 'Chuyến đi rất tuyệt vời. Hải sản tươi ngon, giá cả hợp lý. Tuy nhiên một số khu vực hơi đông du khách.',
      date: '1 tuần trước'
    }
  ]);

  return (
    <div className="container mx-auto">
      <PageHeader 
        title={destination.name}
        description={`Khám phá vẻ đẹp của ${destination.name} - ${destination.location}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
            <div className="grid grid-cols-2 gap-2 p-2">
              {destination.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-lg overflow-hidden ${
                    index === 0 ? 'col-span-2 aspect-2/1' : 'aspect-square'
                  }`}
                >
                  {/* eslint-disable-next-line */}
                  <img
                    src={image}
                    alt={`${destination.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              <TabsTrigger value="map">Bản đồ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                <CardContent className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{destination.description}</p>
                    
                    <h3>Hoạt động nổi bật</h3>
                    <ul>
                      {destination.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4">{review.content}</p>
                    {review.images && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {review.images.map((image, index) => (
                          <div key={index} className="relative aspect-4/3 rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line */}
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs overflow-hidden">
                <div className="h-[400px]">
                  map view ne
                  {/* <MapGL
                    initialViewState={{
                      longitude: destination.coordinates[0],
                      latitude: destination.coordinates[1],
                      zoom: 11
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                  >
                    <Marker 
                      longitude={destination.coordinates[0]} 
                      latitude={destination.coordinates[1]}
                      anchor="bottom"
                    >
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </Marker>
                  </MapGL> */}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium text-lg">{destination.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({destination.reviews} đánh giá)
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{destination.visitors} lượt ghé thăm</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="outline"
                    className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-purple-100 dark:border-purple-900">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Thời tiết hiện tại</div>
                  <div className="font-medium">{destination.weather.current}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Nhiệt độ</div>
                  <div className="font-medium">{destination.weather.temperature}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Độ ẩm</div>
                  <div className="font-medium">{destination.weather.humidity}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Thời điểm đẹp nhất</div>
                  <div className="font-medium">{destination.bestTimeToVisit}</div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Camera className="h-4 w-4 mr-2" />
                  Chia sẻ trải nghiệm
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ địa điểm
                </Button>
                <Button variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu địa điểm
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Địa điểm lân cận</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line */}
                    <img
                      src="https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Hòn Thơm"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Hòn Thơm</h4>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Cách 5km</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line */}
                    <img
                      src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Bãi Sao"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Bãi Sao</h4>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Cách 8km</span>
                    </div>
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