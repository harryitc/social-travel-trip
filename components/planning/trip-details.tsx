'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Edit, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SavedTrip } from './saved-trips';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TripDetailsProps {
  trip: SavedTrip;
  onBack: () => void;
  onEdit: (trip: SavedTrip) => void;
}

// Helper function to check if the trip has itinerary data
const hasTripItinerary = (trip: SavedTrip): boolean => {
  return !!trip.itinerary && Array.isArray(trip.itinerary) && trip.itinerary.length > 0;
};

// Generate default itinerary if the trip doesn't have one
const generateDefaultItinerary = (trip: SavedTrip): TripDay[] => {
  const days: TripDay[] = [];
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  const currentDate = new Date(startDate);
  let dayCounter = 1;

  while (currentDate <= endDate) {
    days.push({
      id: `day-${dayCounter}`,
      date: format(currentDate, 'yyyy-MM-dd'),
      activities: [
        {
          id: `activity-${dayCounter}-1`,
          time: '09:00',
          title: 'Khám phá địa điểm',
          description: 'Tham quan các địa điểm du lịch nổi tiếng trong khu vực',
          location: 'Trung tâm thành phố',
        },
        {
          id: `activity-${dayCounter}-2`,
          time: '12:00',
          title: 'Ăn trưa',
          description: 'Thưởng thức ẩm thực địa phương',
          location: 'Nhà hàng địa phương',
        },
        {
          id: `activity-${dayCounter}-3`,
          time: '15:00',
          title: 'Nghỉ ngơi',
          description: 'Thư giãn tại khách sạn hoặc khu nghỉ dưỡng',
          location: 'Khách sạn',
        },
        {
          id: `activity-${dayCounter}-4`,
          time: '18:00',
          title: 'Ăn tối',
          description: 'Thưởng thức bữa tối tại nhà hàng nổi tiếng',
          location: 'Nhà hàng',
        },
      ],
    });

    currentDate.setDate(currentDate.getDate() + 1);
    dayCounter++;
  }

  return days;
};

export function TripDetails({ trip, onBack, onEdit }: TripDetailsProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  // Use the trip's itinerary if available, otherwise generate a default one
  const tripDays = hasTripItinerary(trip) ? trip.itinerary : generateDefaultItinerary(trip);

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <Button
          variant="outline"
          onClick={() => onEdit(trip)}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
            <div
              className="aspect-video relative cursor-pointer"
              onClick={() => setShowFullImage(true)}
            >
              {/* eslint-disable-next-line */}
              <img
                src={trip.image}
                alt={trip.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium">Xem ảnh đầy đủ</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{trip.name}</CardTitle>
              <CardDescription className="text-base">{trip.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{trip.days} ngày</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  <span>Tạo bởi: Bạn</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Lịch trình chuyến đi</h3>
                <Tabs defaultValue={tripDays[0]?.date} className="w-full">
                  <TabsList className="mb-4 flex flex-nowrap overflow-x-auto pb-1 max-w-full">
                    {tripDays.map((day, index) => (
                      <TabsTrigger key={day.date} value={day.date} className="text-sm whitespace-nowrap">
                        Ngày {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tripDays.map((day, dayIndex) => (
                    <TabsContent key={day.date} value={day.date} className="space-y-4">
                      <Card className="border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-gray-950/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Badge className="mr-2 bg-purple-100 text-purple-700 border-0 dark:bg-purple-900/50 dark:text-purple-300">
                              Ngày {dayIndex + 1}
                            </Badge>
                            {formatDate(day.date)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {day.activities.map((activity, activityIndex) => (
                              <div
                                key={activityIndex}
                                className="border border-purple-100 dark:border-purple-900 rounded-lg p-3 bg-white/80 dark:bg-gray-950/80"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-purple-600 dark:text-purple-400 font-medium min-w-[50px] font-sans">
                                    {activity.time}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{activity.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                    {activity.location && (
                                      <div className="text-xs text-muted-foreground flex items-center mt-2">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {activity.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm sticky top-20">
            <CardHeader>
              <CardTitle>Thông tin chuyến đi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Thời gian</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Số ngày</h4>
                <p className="text-sm text-muted-foreground">{trip.days} ngày</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Ngày tạo</h4>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(trip.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Cập nhật lần cuối</h4>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(trip.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => onEdit(trip)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa kế hoạch
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Full image dialog */}
      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            {/* eslint-disable-next-line */}
            <img
              src={trip.image}
              alt={trip.name}
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
