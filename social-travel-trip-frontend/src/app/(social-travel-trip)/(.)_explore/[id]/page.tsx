'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Heart, MapPin, Users, Calendar, Star, Share2, Bookmark, Camera, View, Map } from 'lucide-react';
// import { Map as MapGL, Marker } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import { useParams } from 'next/navigation';
import { GoogleMapsView } from '@/features/view360';

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
  const id = params.id as string;

  // Dữ liệu cho các địa điểm khác nhau
  const destinationsData = {
    '1': {
      id: '1',
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
      googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747330345274!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ09oN2JLblFF!2m2!1d10.05725757562915!2d104.0363948436442!3f252.2606279243012!4f-33.282491262245465!5f0.4000000000000002',
      images: [
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      panoramaScenes: [
        {
          id: 'beach',
          name: 'Bãi Sao',
          image: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
          description: 'Bãi biển cát trắng mịn nhất Phú Quốc',
          position: { lat: 10.2896, lng: 103.9567 },
          hotspots: [
            {
              id: 'resort',
              name: 'Vinpearl Resort',
              position: { yaw: '45deg', pitch: '0deg' },
              tooltip: 'Đi đến Vinpearl Resort'
            },
            {
              id: 'cable-car',
              name: 'Cáp treo Hòn Thơm',
              position: { yaw: '120deg', pitch: '10deg' },
              tooltip: 'Đi đến Cáp treo Hòn Thơm'
            }
          ]
        },
        {
          id: 'resort',
          name: 'Vinpearl Resort',
          image: 'https://pannellum.org/images/alma.jpg',
          description: 'Khu nghỉ dưỡng sang trọng',
          position: { lat: 10.3112, lng: 103.8405 },
          hotspots: [
            {
              id: 'beach',
              name: 'Bãi Sao',
              position: { yaw: '225deg', pitch: '0deg' },
              tooltip: 'Quay lại Bãi Sao'
            },
            {
              id: 'fishing-village',
              name: 'Làng chài Hàm Ninh',
              position: { yaw: '90deg', pitch: '5deg' },
              tooltip: 'Đi đến Làng chài Hàm Ninh'
            }
          ]
        },
        {
          id: 'cable-car',
          name: 'Cáp treo Hòn Thơm',
          image: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg',
          description: 'Cáp treo vượt biển dài nhất thế giới',
          position: { lat: 10.1689, lng: 103.8921 },
          hotspots: [
            {
              id: 'beach',
              name: 'Bãi Sao',
              position: { yaw: '300deg', pitch: '-10deg' },
              tooltip: 'Quay lại Bãi Sao'
            },
            {
              id: 'fishing-village',
              name: 'Làng chài Hàm Ninh',
              position: { yaw: '180deg', pitch: '0deg' },
              tooltip: 'Đi đến Làng chài Hàm Ninh'
            }
          ]
        },
        {
          id: 'fishing-village',
          name: 'Làng chài Hàm Ninh',
          image: 'https://pannellum.org/images/cerro-toco-0.jpg',
          description: 'Làng chài cổ với hải sản tươi ngon',
          position: { lat: 10.3456, lng: 103.8765 },
          hotspots: [
            {
              id: 'resort',
              name: 'Vinpearl Resort',
              position: { yaw: '270deg', pitch: '5deg' },
              tooltip: 'Đi đến Vinpearl Resort'
            },
            {
              id: 'cable-car',
              name: 'Cáp treo Hòn Thơm',
              position: { yaw: '0deg', pitch: '0deg' },
              tooltip: 'Đi đến Cáp treo Hòn Thơm'
            }
          ]
        }
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
    },
    '2': {
      id: '2',
      name: 'Đà Lạt',
      description: `Đà Lạt - thành phố ngàn hoa với khí hậu mát mẻ quanh năm, cảnh quan thiên nhiên tuyệt đẹp và kiến trúc độc đáo. Đây là điểm đến lý tưởng cho những ai yêu thích thiên nhiên, muốn tận hưởng không khí trong lành và khám phá văn hóa Tây Nguyên.

Những điểm tham quan nổi bật:
- Hồ Xuân Hương
- Thung lũng Tình Yêu
- Đồi Robin
- Ga Đà Lạt
- Vườn hoa thành phố
- Làng Cù Lần

Thời điểm lý tưởng để đến Đà Lạt là từ tháng 12 đến tháng 3 năm sau, khi thời tiết khô ráo và mát mẻ.`,
      location: 'Lâm Đồng',
      coordinates: [108.4583, 11.9404],
      googleMapsUrl: 'https://maps.app.goo.gl/Yx9Qd4Yx9Qd4Yx9Qd4',
      images: [
        'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/5191362/pexels-photo-5191362.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/5191367/pexels-photo-5191367.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/5191369/pexels-photo-5191369.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      panoramaScenes: [
        {
          id: 'lake',
          name: 'Hồ Xuân Hương',
          image: 'https://pannellum.org/images/cerro-toco-0.jpg',
          description: 'Hồ nước ngọt nhân tạo trung tâm Đà Lạt',
          position: { lat: 11.9404, lng: 108.4583 },
          hotspots: [
            {
              id: 'flower-garden',
              name: 'Vườn hoa thành phố',
              position: { yaw: '45deg', pitch: '0deg' },
              tooltip: 'Đi đến Vườn hoa thành phố'
            },
            {
              id: 'valley',
              name: 'Thung lũng Tình Yêu',
              position: { yaw: '120deg', pitch: '10deg' },
              tooltip: 'Đi đến Thung lũng Tình Yêu'
            }
          ]
        },
        {
          id: 'flower-garden',
          name: 'Vườn hoa thành phố',
          image: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg',
          description: 'Vườn hoa đẹp nhất Đà Lạt',
          position: { lat: 11.9456, lng: 108.4623 },
          hotspots: [
            {
              id: 'lake',
              name: 'Hồ Xuân Hương',
              position: { yaw: '225deg', pitch: '0deg' },
              tooltip: 'Quay lại Hồ Xuân Hương'
            },
            {
              id: 'station',
              name: 'Ga Đà Lạt',
              position: { yaw: '90deg', pitch: '5deg' },
              tooltip: 'Đi đến Ga Đà Lạt'
            }
          ]
        },
        {
          id: 'valley',
          name: 'Thung lũng Tình Yêu',
          image: 'https://pannellum.org/images/alma.jpg',
          description: 'Thung lũng lãng mạn của Đà Lạt',
          position: { lat: 11.9234, lng: 108.4456 },
          hotspots: [
            {
              id: 'lake',
              name: 'Hồ Xuân Hương',
              position: { yaw: '300deg', pitch: '-10deg' },
              tooltip: 'Quay lại Hồ Xuân Hương'
            },
            {
              id: 'station',
              name: 'Ga Đà Lạt',
              position: { yaw: '180deg', pitch: '0deg' },
              tooltip: 'Đi đến Ga Đà Lạt'
            }
          ]
        },
        {
          id: 'station',
          name: 'Ga Đà Lạt',
          image: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
          description: 'Nhà ga cổ kính nhất Việt Nam',
          position: { lat: 11.9432, lng: 108.4587 },
          hotspots: [
            {
              id: 'flower-garden',
              name: 'Vườn hoa thành phố',
              position: { yaw: '270deg', pitch: '5deg' },
              tooltip: 'Đi đến Vườn hoa thành phố'
            },
            {
              id: 'valley',
              name: 'Thung lũng Tình Yêu',
              position: { yaw: '0deg', pitch: '0deg' },
              tooltip: 'Đi đến Thung lũng Tình Yêu'
            }
          ]
        }
      ],
      tags: ['Núi', 'Hồ', 'Mát mẻ', 'Hoa', 'Cà phê'],
      rating: 4.7,
      reviews: 1876,
      visitors: 9543,
      weather: {
        current: 'Mát mẻ',
        temperature: '22°C',
        humidity: '85%'
      },
      bestTimeToVisit: 'Tháng 12 - Tháng 3',
      activities: [
        'Tham quan vườn hoa',
        'Chèo thuyền trên hồ',
        'Cắm trại',
        'Thưởng thức cà phê',
        'Khám phá thác nước',
        'Đi xe ngựa'
      ]
    },
    '3': {
      id: '3',
      name: 'Hạ Long',
      description: `Vịnh Hạ Long - kỳ quan thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi và hang động kỳ thú. Đây là điểm đến nổi tiếng nhất của Việt Nam, thu hút hàng triệu du khách trong và ngoài nước mỗi năm.

Những điểm tham quan nổi bật:
- Hang Sửng Sốt
- Đảo Ti Tốp
- Hang Đầu Gỗ
- Làng chài Cửa Vạn
- Đảo Tuần Châu
- Vịnh Bái Tử Long

Thời điểm lý tưởng để đến Hạ Long là từ tháng 10 đến tháng 4 năm sau, khi thời tiết mát mẻ và ít mưa.`,
      location: 'Quảng Ninh',
      coordinates: [107.0448, 20.9101],
      googleMapsUrl: 'https://maps.app.goo.gl/Yx9Qd4Yx9Qd4Yx9Qd4',
      images: [
        'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/4350631/pexels-photo-4350631.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/4871012/pexels-photo-4871012.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/4350626/pexels-photo-4350626.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      panoramaScenes: [
        {
          id: 'bay-view',
          name: 'Toàn cảnh Vịnh',
          image: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
          description: 'Ngắm nhìn toàn cảnh Vịnh Hạ Long',
          position: { lat: 20.9101, lng: 107.0448 },
          hotspots: [
            {
              id: 'titop-island',
              name: 'Đảo Ti Tốp',
              position: { yaw: '45deg', pitch: '0deg' },
              tooltip: 'Đi đến Đảo Ti Tốp'
            },
            {
              id: 'surprise-cave',
              name: 'Hang Sửng Sốt',
              position: { yaw: '120deg', pitch: '10deg' },
              tooltip: 'Đi đến Hang Sửng Sốt'
            }
          ]
        },
        {
          id: 'titop-island',
          name: 'Đảo Ti Tốp',
          image: 'https://pannellum.org/images/alma.jpg',
          description: 'Đảo nhỏ với bãi tắm đẹp và view toàn cảnh',
          position: { lat: 20.8991, lng: 107.0673 },
          hotspots: [
            {
              id: 'bay-view',
              name: 'Toàn cảnh Vịnh',
              position: { yaw: '225deg', pitch: '0deg' },
              tooltip: 'Quay lại ngắm toàn cảnh'
            },
            {
              id: 'fishing-village',
              name: 'Làng chài Cửa Vạn',
              position: { yaw: '90deg', pitch: '5deg' },
              tooltip: 'Đi đến Làng chài Cửa Vạn'
            }
          ]
        },
        {
          id: 'surprise-cave',
          name: 'Hang Sửng Sốt',
          image: 'https://pannellum.org/images/cerro-toco-0.jpg',
          description: 'Hang động lớn nhất và đẹp nhất Hạ Long',
          position: { lat: 20.9012, lng: 107.0541 },
          hotspots: [
            {
              id: 'bay-view',
              name: 'Toàn cảnh Vịnh',
              position: { yaw: '300deg', pitch: '-10deg' },
              tooltip: 'Quay lại ngắm toàn cảnh'
            },
            {
              id: 'fishing-village',
              name: 'Làng chài Cửa Vạn',
              position: { yaw: '180deg', pitch: '0deg' },
              tooltip: 'Đi đến Làng chài Cửa Vạn'
            }
          ]
        },
        {
          id: 'fishing-village',
          name: 'Làng chài Cửa Vạn',
          image: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg',
          description: 'Làng chài nổi trên vịnh Hạ Long',
          position: { lat: 20.8876, lng: 107.0512 },
          hotspots: [
            {
              id: 'titop-island',
              name: 'Đảo Ti Tốp',
              position: { yaw: '270deg', pitch: '5deg' },
              tooltip: 'Đi đến Đảo Ti Tốp'
            },
            {
              id: 'surprise-cave',
              name: 'Hang Sửng Sốt',
              position: { yaw: '0deg', pitch: '0deg' },
              tooltip: 'Đi đến Hang Sửng Sốt'
            }
          ]
        }
      ],
      tags: ['Vịnh', 'Di sản', 'Hang động', 'Đảo', 'Du thuyền'],
      rating: 4.9,
      reviews: 3245,
      visitors: 15754,
      weather: {
        current: 'Nắng nhẹ',
        temperature: '25°C',
        humidity: '80%'
      },
      bestTimeToVisit: 'Tháng 10 - Tháng 4',
      activities: [
        'Du thuyền',
        'Chèo thuyền kayak',
        'Tham quan hang động',
        'Tắm biển',
        'Leo núi',
        'Ngắm hoàng hôn'
      ]
    }
  };

  // Lấy dữ liệu dựa trên ID, nếu không có thì mặc định là Phú Quốc (ID: 1)
  const [destination] = useState(destinationsData[id as keyof typeof destinationsData] || destinationsData['1']);

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
              <TabsTrigger value="view360">View 360°</TabsTrigger>
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

            <TabsContent value="view360" className="mt-6">
              <Tabs defaultValue="bai-sao">
                <TabsList>
                  <TabsTrigger value="bai-sao">Bãi Sao</TabsTrigger>
                  <TabsTrigger value="hon-thom">Hòn Thơm</TabsTrigger>
                  <TabsTrigger value="vinpearl">Vinpearl Resort</TabsTrigger>
                  <TabsTrigger value="rach-vem">Rạch Vẹm</TabsTrigger>
                </TabsList>

                <TabsContent value="bai-sao" className="mt-4">
                  {destination.googleMapsUrl ? (
                    <div className="space-y-6">
                      <GoogleMapsView
                        mapUrl={destination.googleMapsUrl}
                        height="500px"
                      />

                      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Map className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                              <h4 className="font-medium">Bãi Sao</h4>
                              <p className="text-sm text-muted-foreground">
                                Xem hình ảnh 360° thực tế từ Google Maps. Bạn có thể di chuyển trong hình ảnh bằng cách kéo chuột hoặc sử dụng các điều khiển trên màn hình.
                              </p>
                              <Button
                                variant="link"
                                className="p-0 h-auto text-purple-600 dark:text-purple-400"
                                onClick={() => window.open(destination.googleMapsUrl, '_blank')}
                              >
                                Mở trong Google Maps
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Không có hình ảnh 360° cho Bãi Sao</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="hon-thom" className="mt-4">
                  <div className="space-y-6">
                    <GoogleMapsView
                      mapUrl="https://www.google.com/maps/embed?pb=!4v1747332749752!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzR3NERDSUE.!2m2!1d9.954605838430725!2d104.0178143976055!3f352.99579097798187!4f-11.542141392533921!5f0.7820865974627469"
                      height="500px"
                    />

                    <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Map className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div>
                            <h4 className="font-medium">Hòn Thơm</h4>
                            <p className="text-sm text-muted-foreground">
                              Xem hình ảnh 360° thực tế từ Google Maps. Bạn có thể di chuyển trong hình ảnh bằng cách kéo chuột hoặc sử dụng các điều khiển trên màn hình.
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-purple-600 dark:text-purple-400"
                              onClick={() => window.open("https://www.google.com/maps/embed?pb=!4v1747332749752!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzR3NERDSUE.!2m2!1d9.954605838430725!2d104.0178143976055!3f352.99579097798187!4f-11.542141392533921!5f0.7820865974627469", '_blank')}
                            >
                              Mở trong Google Maps
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="vinpearl" className="mt-4">
                  <div className="space-y-6">
                    <GoogleMapsView
                      mapUrl="https://www.google.com/maps/embed?pb=!4v1747332930528!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRyZV9zUlE.!2m2!1d10.33683427532572!2d103.8555491298273!3f9.87975441837457!4f-61.96086477266688!5f0.7820865974627469"
                      height="500px"
                    />

                    <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Map className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div>
                            <h4 className="font-medium">Vinpearl Resort</h4>
                            <p className="text-sm text-muted-foreground">
                              Xem hình ảnh 360° thực tế từ Google Maps. Bạn có thể di chuyển trong hình ảnh bằng cách kéo chuột hoặc sử dụng các điều khiển trên màn hình.
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-purple-600 dark:text-purple-400"
                              onClick={() => window.open("https://www.google.com/maps/embed?pb=!4v1747332930528!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRyZV9zUlE.!2m2!1d10.33683427532572!2d103.8555491298273!3f9.87975441837457!4f-61.96086477266688!5f0.7820865974627469", '_blank')}
                            >
                              Mở trong Google Maps
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="rach-vem" className="mt-4">
                  <div className="space-y-6">
                    <GoogleMapsView
                      mapUrl="https://www.google.com/maps/embed?pb=!4v1747333532742!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRqZGo5S0E.!2m2!1d10.37304277793628!2d103.9377705339461!3f216.24777645854576!4f-0.38721998348161435!5f0.7820865974627469"
                      height="500px"
                    />

                    <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Map className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div>
                            <h4 className="font-medium">Rạch Vẹm</h4>
                            <p className="text-sm text-muted-foreground">
                              Xem hình ảnh 360° thực tế từ Google Maps. Bạn có thể di chuyển trong hình ảnh bằng cách kéo chuột hoặc sử dụng các điều khiển trên màn hình.
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-purple-600 dark:text-purple-400"
                              onClick={() => window.open("https://www.google.com/maps/embed?pb=!4v1747333532742!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRqZGo5S0E.!2m2!1d10.37304277793628!2d103.9377705339461!3f216.24777645854576!4f-0.38721998348161435!5f0.7820865974627469", '_blank')}
                            >
                              Mở trong Google Maps
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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